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

  if(body.webhook_code ==="INITIAL_UPDATE"){
    console.log('THIS IS THE INITAL 30 DAY PULL',body)
  }
  
  if(body.webhook_code==="HISTORICAL_UPDATE"){
    console.log("THE WEBHOOK BRUH",body)

    try{

      const item_id = body.item_id;
  
      const pgItemId = await qs.WEB_get_pg_itemid(item_id)
      
  
      const InsertionStart = await qs.WEB_track_insertion(pgItemId.id, 'inserting')
  
      console.log('THE INSERTION BEGINNING', InsertionStart)
  
      //code up here to get set variables to stings of todays date, and another dat 45 days back

      const {access_token} = await qs.WEB_get_accessToken(item_id)
      console.log('THE ACCESS TOKEN', access_token)
  
      const {transactions} = await client.getTransactions(access_token,'2019-01-01','2019-01-31');
  

     const done = await qs.WEB_insert_transactions(transactions)
  
    const InsertionEnd = await qs.WEB_track_insertion(pgItemId.id, 'done')
  
      console.log('THE INSERTION ENDING', InsertionEnd)
    }catch(err){
      console.log('ERROR', err)
    }

  }

  //if webhook_code = 'Default_update'
  //then insirt the new transaction into the db

  //Everything that happens in here is between plaid and our server, the database can be somthing to consider 
  //in terms of letting node know the transactions are ready


  //basically when this is done, i want the front end to be sent those transactions or be alerted to get them
  //but since PLAID is the sender of this data. running res.send on this wouldn't go to our user
  res.end()
})

router.post('/transactions',checkAccessToken, async (req,res)=>{

  const body = req.body;
 
  console.log("the request body", req.body)

  //get the last thing inserted into the insertion table

  try{
    const status = qs.INFO_get_status(body.userid)

    console.log(status)

  }catch(err){
    console.log(err)
  }

})

module.exports = router;
