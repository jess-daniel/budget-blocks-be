require("dotenv").config();
const express = require("express");
const plaid = require("plaid");
const qs = require("./plaidModel.js");
const User = require("../users/users-model.js");
const data = require("./data.js");
const jwt = require("jsonwebtoken");

const paramCheck = require("../users/paramCheck.js");

const checkAccessToken = require("./getAccessToken-middleware.js");

const router = express.Router();

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2019-05-29", clientApp: "Plaid Quickstart" }
);

// Checks if an access token exists for the user
function publicTokenExists(req, res, next) {
  // Check if the body contains any information
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "No information was passed into the body." });
  } else {
    // check specifically for the public token
    if (!req.body.publicToken) {
      res.status(400).json({ error: "You have not sync'd your bank account." });
      // If no errrors, allow the middleware to go to the next endpoint
    } else {
      // res.status(200).json({message: req.body.publicToken});
      next();
    }
  }
}

router.post("/token_exchange", publicTokenExists, async (req, res) => {
  const { publicToken } = req.body;
  const { userid } = req.body;

  if (!publicToken || !userid) {
    res.status(400).json({
      message:
        "make sure there is a userid and publicToken key on the request object you send"
    });
  }

  try {
    const { access_token } = await client.exchangePublicToken(publicToken);

    const Accessid = await qs.add_A_Token(access_token, userid);

    const { item } = await client.getItem(access_token);

    const Itemid = await qs.add_An_Item(item.item_id, userid);

    const { accounts } = await client.getBalance(access_token);

    const doneAccounts = await qs.PLAID_insert_accounts(accounts, Itemid);

    const categories = await User.returnUserCategories(userid);
    if (categories.length == 0) {
      //same thing, it just needs to insert into the user_category linking table the default categories
      //if I have time, I'll come back to this to optimize it like line 102
      const doneData = Promise.all(
        data.map(async d => {
          try {
            const contents = await qs.link_user_categories(d.id, userid);
            return d;
          } catch (error) {
            console.log(error);
          }
        })
      );

      const newCategories = await User.returnUserCategories(userid);

      if (newCategories.length > 0) {
        res.status(201).json({
          accessCreated: Accessid,
          ItemCreated: Itemid
        });
      } else {
        res.status(409).json({ message: "cant link categories at this time" });
      }
    } else {
      res.status(201).json({
        accessCreated: Accessid,
        ItemCreated: Itemid
      });
    }
  } catch (err) {
    console.log("access", err);
    res.status(500).json({ message: "cant insert at this time" });
  }
});

router.get(
  "/transactions/:userId",paramCheck.userExists,paramCheck.onlyId,paramCheck.tokenMatchesUserId,
  checkAccessToken,
  async (req, res) => {
    const id = req.params.userId;

    try {
      //This is the check needed to make sure our front end has something to work on. It's checking if our user has any plaid 'items' that have outstanding downloads. The conditional below is as follows.
      const status = await qs.INFO_get_status(id);
      const pgItemId = await qs.PLAID_get_pg_item_id(id);

      //I understand its redundant to have status.status, but just keep it. This error handling depends on it. Turst me on this one
      if (!status) {
        const code = 330;
        res
          .status(330)
          .json({ message: "insertion process hasn't started", code });
      } else {
        switch (status.status) {
          //when the status is done, run a super query to get the categories and their transactions
          case "done":
            const categories = await qs.INFO_get_categories(id);
            const cat = categories.filter(cat => {
              if (cat != null) {
                return cat;
              }
            });
            //first get the latest balance info
            const balance = await client.getBalance(req.body.access);
            if (!balance) {
              //if Plaid is down just send what we have
              console.log("PLAID IS DOWN");
              const balances = await qs.PLAID_get_accounts(pgItemId.id);
              res.status(200).json({ Categories: cat, accounts: balances });
            } else {
              //if Plaid is up, take the most recent and update our db, and send them back in our db's format
              const accounts = balance.accounts;
              //update our records
              const updatedAccounts = await qs.PLAID_update_accounts(accounts);
              //get our records
              const balances = await qs.PLAID_get_accounts(pgItemId.id);
              //send categories and account balances back to the user
              res.status(200).json({ Categories: cat, accounts: balances });
            }
            break;
          case "inserting":
            const insertCode = 300;
            res
              .status(insertCode)
              .json({ message: "we are inserting your data", insertCode });
            break;
          case "failure":
            const failureCode = 503;
            res
              .status(failureCode)
              .json({ message: "could not connect to plaid", failureCode });
        }
      }
    } catch (err) {
      console.log("THE ERROR IM LOOKING FOR", err);
      res.status(500).json({ message: "cant get transactions" });
    }
  }
);

module.exports = router;
