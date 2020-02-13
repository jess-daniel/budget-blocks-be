require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const qs = require('./plaidModel.js');
const data = require('./data.js');

const checkAccessToken = require("./getAccessToken-middleware.js");
const webhookMiddle = require('./webhook-middleware.js');

const router = express.Router();


const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments[process.env.PLAID_ENV],
  {version: '2019-05-29', clientApp: 'Plaid Quickstart'},
);

// Checks if an access token exists for the user
function publicTokenExists(req, res, next) {
  // Check if the body contains any information
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({error: 'No information was passed into the body.'});
  } else {
    // check specifically for the public token
    if (!req.body.publicToken) {
      res.status(400).json({error: "You have not sync'd your bank account."});
      // If no errrors, allow the middleware to go to the next endpoint
    } else {
      // res.status(200).json({message: req.body.publicToken});
      next();
    }
  }
}


router.post('/token_exchange', publicTokenExists, async (req, res) => {
  const {publicToken} = req.body;
  const {userid} = req.body;

  if(!publicToken || !userid){
    res.status(400).json({message:"make sure there is a userid and publicToken key on the request object you send"})
  }

  try {
    const {access_token} = await client.exchangePublicToken(publicToken);

    const Accessid = await qs.add_A_Token(access_token, userid);

    const {item} = await client.getItem(access_token);

    const Itemid = await qs.add_An_Item(item.item_id, userid);

    const {accounts} = await client.getBalance(access_token);

    const doneAccounts = await qs.PLAID_insert_accounts(accounts,Itemid)

  
    //same thing, it just needs to insert into the user_category linking table the default categories
    //if I have time, I'll come back to this to optimize it like line 102
    const doneData = Promise.all(
      data.map(async d => {
        const contents = await qs.link_user_categories(d.id, userid);
        return d;
      }),
    );

    res.status(201).json({
      accessCreated: Accessid,
      ItemCreated:Itemid
      
    });
  } catch (err) {
    console.log('access', err);
    res.status(500).json({message:'cant insert at this time'})
  }
});

//This is comming from PLAID, res.send or any variation will just be sending to plaid
router.post('/webhook', webhookMiddle, async (req,res)=>{
  const body = req.body;

  
  //changed this to initial update becuase honestly we just need the last 30 days, not their life story 
  if(body.webhook_code==="INITIAL_UPDATE"){
    console.log("INITIAL PULL",body)

    try{

      // This basically inserts a row that says that the transaction download into our db for this Item, essenially this user, has begun
      const InsertionStart = await qs.WEB_track_insertion(body.pgItemId.id, 'inserting')
  
      console.log('THE INSERTION BEGINNING', InsertionStart)
  
      //We just get the access token based on the ItemID plaid gave us to make sure we are accessing the transactions for that EXACT set of credentials
      const {access_token} = await qs.WEB_get_accessToken(body.item_id)

      console.log("DATE RANGE FOR TRANSACTIONS",body.start, body.end)
      //This is us getting the transactions 
      const {transactions} = await client.getTransactions(access_token, body.start, body.end);

      if(!transactions){
        const InsertionFail = await qs.WEB_track_insertion(body.pgItemId.id, 'failure')

        res.status(500).json({message:'contacting Plaid failed', status:InsertionFail.status})
      }

      //This is a more refined version of what I had before on line 54. 
      const done = await qs.WEB_insert_transactions(transactions, body.userID.id)

     //basically makes sure that the notification that the download is complete waits on it actually completing.
     if(done){ 
       const InsertionEnd = await qs.WEB_track_insertion(body.pgItemId.id, 'done')
       console.log('THE INSERTION ENDING', InsertionEnd)
       res.status(200)
     }
  
  
    }catch(err){
      console.log('INITAL ERROR', err)
      res.status(500)
    }
  }else if(body.webhook_code==="DEFAULT_UPDATE"){
    console.log('DEFAULT UPDATE', body)

    const amountOfNew = body.new_transactions

    try{

      //This basically inserts a row that says that the transaction download into our db for this Item, essenially this user, has begun
      const InsertionStart = await qs.WEB_track_insertion(body.pgItemId.id, 'inserting')
  
      console.log('THE INSERTION BEGINNING', InsertionStart)
  
      //We just get the access token based on the ItemID plaid gave us to make sure we are accessing the transactions for that EXACT set of credentials
      const {access_token} = await qs.WEB_get_accessToken(body.item_id)
   
      console.log("DATE RANGE FOR TRANSACTIONS",body.start, body.end)
      
      //This is us getting the transactions 
      const {transactions} = await client.getTransactions (access_token, body.start, body.end, {count:amountOfNew});

      if(!transactions){
        const InsertionFail = await qs.WEB_track_insertion(body.pgItemId.id, 'failure')

        res.status(500).json({message:'contacting Plaid failed', status:InsertionFail.status})
      }

      //This is a more refined version of what I had before on line 54. 
      const done = await qs.WEB_insert_transactions(transactions, body.userID.id)

     //basically makes sure that the notification that the download is complete waits on it actually completing.
     if(done){ 
       const InsertionEnd = await qs.WEB_track_insertion(body.pgItemId.id, 'done')
       console.log('THE INSERTION ENDING', InsertionEnd)
     }
  
     res.status(200)
    }catch(err){
      console.log("UPDATE ERROR",err)
    }

  }

})

router.get('/transactions/:id',checkAccessToken, async (req,res)=>{

  const id = req.params.id;

  if(!id){
    res.status(400).json({message:'please add a param to the end of the endpoint'})
    
  }
 
  try{
      //This is the check needed to make sure our front end has something to work on. It's checking if our user has any plaid 'items' that have outstanding downloads. The conditional below is as follows.
      const status = await qs.INFO_get_status(id)
      const pgItemId = await qs.PLAID_get_pg_item_id(id)

      //I understand its redundant to have status.status, but just keep it. This error handling depends on it. Turst me on this one
      if(!status){
        const code = 330
        res.status(330).json({message:"insertion process hasn't started", code})
      }else{
        switch(status.status){
          //when the status is done, run a super query to get the categories and their transactions 
          case 'done':
              const categories = await qs.INFO_get_categories(id)
              const cat = categories.filter((cat)=>{
                if(cat != null){
                  return cat
                }
              })
              //first get the latest balance info
              const balance = await client.getBalance(req.body.access)
              if(!balance){
                //if Plaid is down just send what we have
                console.log("PLAID IS DOWN")
                const balances = await qs.PLAID_get_accounts(pgItemId.id)
                res.status(200).json({Categories:cat, accounts:balances})
              }else{
                //if Plaid is up, take the most recent and update our db, and send them back in our db's format
                const accounts = balance.accounts
                //update our records
                const updatedAccounts = await qs.PLAID_update_accounts(accounts)
                //get our records
                const balances = await qs.PLAID_get_accounts(pgItemId.id)
                //send categories and account balances back to the user
                res.status(200).json({Categories:cat,accounts: balances})
              }
              break;
          case 'inserting':
              const insertCode = 300
              res.status(insertCode).json({message:"we are inserting your data",insertCode})
              break;
          case 'failure':
              const failureCode = 503
              res.status(failureCode).json({message:'could not connect to plaid', failureCode})
        }
      }

  }catch(err){
    console.log('THE ERROR IM LOOKING FOR',err)
    res.status(500).json({message:'cant get transactions'})
  }

})

module.exports = router;