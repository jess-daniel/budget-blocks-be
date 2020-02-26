const express = require("express");
const plaid = require("plaid");
const qs = require("../plaid/plaidModel.js");
const data = require("../plaid/data.js");

const router = express.Router();

// Middleware
const webhookMiddle = require("./webhook-middleware.js");

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2019-05-29", clientApp: "Plaid Quickstart" }
);

//This is comming from PLAID, res.send or any variation will just be sending to plaid
router.post("/", webhookMiddle, async (req, res) => {
  const body = req.body;

  //changed this to initial update becuase honestly we just need the last 30 days, not their life story
  if (body.webhook_code === "INITIAL_UPDATE") {
    console.log("INITIAL PULL", body);

    try {
      // This basically inserts a row that says that the transaction download into our db for this Item, essenially this user, has begun
      const InsertionStart = await qs.WEB_track_insertion(
        body.pgItemId.id,
        "inserting"
      );

      console.log("THE INSERTION BEGINNING", InsertionStart);

      //We just get the access token based on the ItemID plaid gave us to make sure we are accessing the transactions for that EXACT set of credentials
      const { access_token } = await qs.WEB_get_accessToken(body.item_id);

      console.log("DATE RANGE FOR TRANSACTIONS", body.start, body.end);
      //This is us getting the transactions
      const { transactions } = await client.getTransactions(
        access_token,
        body.start,
        body.end
      );

      if (!transactions) {
        const InsertionFail = await qs.WEB_track_insertion(
          body.pgItemId.id,
          "failure"
        );

        res.status(500).json({
          message: "contacting Plaid failed",
          status: InsertionFail.status
        });
      }

      //This is a more refined version of what I had before on line 54.
      const done = await qs.WEB_insert_transactions(
        transactions,
        body.userID.id
      );

      //basically makes sure that the notification that the download is complete waits on it actually completing.
      if (done) {
        const InsertionEnd = await qs.WEB_track_insertion(
          body.pgItemId.id,
          "done"
        );
        console.log("THE INSERTION ENDING", InsertionEnd);
        res.status(200);
      }
    } catch (err) {
      console.log("INITAL ERROR", err);
      res.status(500);
    }
  } else if (body.webhook_code === "DEFAULT_UPDATE") {
    console.log("DEFAULT UPDATE", body);

    const amountOfNew = body.new_transactions;

    try {
      //This basically inserts a row that says that the transaction download into our db for this Item, essenially this user, has begun
      const InsertionStart = await qs.WEB_track_insertion(
        body.pgItemId.id,
        "inserting"
      );

      console.log("THE INSERTION BEGINNING", InsertionStart);

      //We just get the access token based on the ItemID plaid gave us to make sure we are accessing the transactions for that EXACT set of credentials
      const { access_token } = await qs.WEB_get_accessToken(body.item_id);

      console.log("DATE RANGE FOR TRANSACTIONS", body.start, body.end);

      //This is us getting the transactions
      const { transactions } = await client.getTransactions(
        access_token,
        body.start,
        body.end,
        { count: amountOfNew }
      );

      if (!transactions) {
        const InsertionFail = await qs.WEB_track_insertion(
          body.pgItemId.id,
          "failure"
        );

        res.status(500).json({
          message: "contacting Plaid failed",
          status: InsertionFail.status
        });
      }

      //This is a more refined version of what I had before on line 54.
      const done = await qs.WEB_insert_transactions(
        transactions,
        body.userID.id
      );

      //basically makes sure that the notification that the download is complete waits on it actually completing.
      if (done) {
        const InsertionEnd = await qs.WEB_track_insertion(
          body.pgItemId.id,
          "done"
        );
        console.log("THE INSERTION ENDING", InsertionEnd);
      }

      res.status(200);
    } catch (err) {
      console.log("UPDATE ERROR", err);
    }
  }
});

module.exports = router;
