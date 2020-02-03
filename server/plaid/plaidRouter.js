require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const qs = require('./plaidModel.js');
const data = require('./data.js');

const checkAccessToken = require("./getAccessToken-middleware.js");

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

  try {
    const {access_token} = await client.exchangePublicToken(publicToken);

    const Accessid = await qs.add_A_Token(access_token, userid);

    const {item} = await client.getItem(access_token);

    const Itemid = await qs.add_An_Item(item.item_id, userid);

  
    //same thing, it just needs to insert into the user_category linking table the default categories
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
  }
});

//This is comming from PLAID, res.send or any variation will just be sending to plaid
router.post('/webhook', async (req,res)=>{
  const body = req.body;

  // if(body.webhook_code ==="INITIAL_UPDATE"){
  //   console.log('THIS IS THE INITAL 30 DAY PULL',body)
  // }
  
  if(body.webhook_code==="HISTORICAL_UPDATE"){
    console.log("THE WEBHOOK BRUH",body)

    try{

      const item_id = body.item_id;
  
      const pgItemId = await qs.WEB_get_pg_itemid(item_id)

      const userID = await qs.WEB_get_userID(item_id)
  
      const InsertionStart = await qs.WEB_track_insertion(pgItemId.id, 'inserting')
  
      console.log('THE INSERTION BEGINNING', InsertionStart)
  
      //code up here to get set variables to stings of todays date, and another dat 30-45 days back

      const {access_token} = await qs.WEB_get_accessToken(item_id)
      
  
      const {transactions} = await client.getTransactions(access_token,'2019-01-01','2019-01-31');
  

     const done = await qs.WEB_insert_transactions(transactions, userID.id)

     if(done){ 
       const InsertionEnd = await qs.WEB_track_insertion(pgItemId.id, 'done')

       console.log('THE INSERTION ENDING', InsertionEnd)
     }
  
  
    }catch(err){
      console.log('ERROR', err)
    }

  }

  res.end()
})

router.post('/transactions',checkAccessToken, async (req,res)=>{

  const body = req.body;
 
  

  try{
    const status = await qs.INFO_get_status(body.userid)


    //I understand its redundant to have status.status, but just keep it. This error handling depends on it
    if(!status){
      res.status(330).json({message:"insertion process hasn't started"})
    }

    if(status.status ==="done"){

      const categories = await qs.INFO_get_categories(body.userid)
      const balance = await client.getBalance(body.access)
      const accounts = balance.accounts
      res.status(200).json({categories,accounts})

    }else if(status.status ==="inserting"){

      res.status(300).json({message:"we are inserting your data"})

    }

    res.end()

  }catch(err){
    console.log('THE ERROR IM LOOKING FOR',err)
  }

})

module.exports = router;