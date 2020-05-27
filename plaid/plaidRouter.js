require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const db = require('./plaidModel.js');

const router = express.Router();

var client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: '2019-05-29', clientApp: 'Budget Blocks' }
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

router.post('/token_exchange/:id', publicTokenExists, (req, res) => {
  const { publicToken } = req.body;

  client.exchangePublicToken(publicToken, function (error, tokenResponse) {
    if (error != null) {
      res.status(500).json({ message: 'Error Exchanging Token', error });
    }
    // console.log(error);

    const ACCESS_TOKEN = tokenResponse.access_token;
    const { id } = req.params;

    db.plaid_access(ACCESS_TOKEN, id)
      .then((key) => {
        if (key) {
          res.status(200).json(key);
        } else {
          res.status(404).json({ message: 'You are missing the user id' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
});

router.get('/accessToken/:id', (req, res) => {
  const user_id = req.params.id;

  db.findTokensByUserId(user_id)
    .then((accessToken) => {
      res.status(200).json({ data: accessToken });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
