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

    // const {transactions} = await client.getTransactions(
    //   access_token,
    //   '2019-01-01',
    //   '2019-01-20',
    // );

    // //I needed to use Promise.all to get this to work asynchronously, but it doesn't need to be displayed in the first place so just leave is as is
    // const done = Promise.all(
    //   transactions.map(async trans => {
    //     const contents = await qs.insert_transactions(trans);
    //     return trans;
    //   }),
    // );

    // const doneData = Promise.all(
    //   data.map(async d => {
    //     const contents = await qs.link_user_categories(d.id, userid);
    //     return d;
    //   }),
    // );

    res.status(201).json({
      AccessTokenInserted: Accessid,
      ItemIdInserted: Itemid
      // TransactionsInserted: transactions,
    });
  } catch (err) {
    console.log('access', err);
  }
});

router.post('/webhook', (req,res)=>{
  const body = req.body;
  console.log("The webhook",body)
  res.end()
})

router.post('/transactions',checkAccessToken, async (req,res)=>{
 
  console.log("the request body", req.body)

  const access = req.body.access
  
  try{

    const {transactions} = await client.getTransactions(access,'2019-01-01','2019-01-20')
    
    res.status(200).json({transactions})
  }catch(err){
    console.log(err)
    res.status(500).json({message:"error sending transactions"})
  }

})

module.exports = router;
