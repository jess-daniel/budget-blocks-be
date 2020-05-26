require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const qs = require('./plaidModel.js');

const router = express.Router();

var client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: '2019-05-29', clientApp: 'Plaid Quickstart' }
);

// Checks if an access token exists for the user
function publicTokenExists(req, res, next) {
  // Check if the body contains any information
  if (Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ error: 'No information was passed into the body.' });
  } else {
    // check specifically for the public token
    if (!req.body.publicToken) {
      res
        .status(400)
        .json({ error: "You have not sync'd your bank account." });
      // If no errrors, allow the middleware to go to the next endpoint
    } else {
      // res.status(200).json({message: req.body.publicToken});
      next();
    }
  }
}

router.post('/token_exchange', publicTokenExists, (req, res) => {
  const { public_token } = req.body;

  client.exchangePublicToken(public_token, function (
    error,
    tokenResponse
  ) {
    if (error != null) {
      return res
        .status(500)
        .json({ message: 'Error Exchanging Token', error });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;

    console.log('Access_Token:', ACCESS_TOKEN);
    console.log('item_id:', ITEM_ID);
  });
});

module.exports = router;
