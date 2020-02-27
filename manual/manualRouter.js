//Plaid model and data
const Plaid = require("../plaid/plaidModel.js");
const data = require("../plaid/data.js");
//user model and data
const paramCheck = require("../users/paramCheck.js");
const User = require("../users/users-model.js");

//manual model
const qs = require("./manualModel.js");

const express = require("express");
const router = express.Router();

router.get(
  "/onboard/:userId",
  paramCheck.onlyId,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const userid = req.params.userId;
    try {
      const categories = await User.returnUserCategories(userid);
      if (categories.length == 0) {
        //same thing as the plaid router. Just need to loop though a default categories and link them to the user thats opted for manual entry.
        const doneData = Promise.all(
          data.map(async d => {
            try {
              const contents = await Plaid.link_user_categories(d.id, userid);
              return d;
            } catch (error) {
              console.log(error);
            }
          })
        );

        const newCategories = await User.returnUserCategories(userid);

        if (newCategories.length > 0) {
          res.status(204).json({ message: "categories made" });
        } else {
          res.status(409).json({ message: "categories not made" });
        }
      } else {
        res.status(205).json({ message: "categories are already there" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);

router.post(
  "/transaction/:userId",
  paramCheck.idAndBody,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const body = req.body;
    const id = req.params.userId;
    if (!body.amount || !body.payment_date || !body.category_id) {
      res.status(401).json({ message: "please send with the correct body" });
    } else {
      try {
        const inserted = await qs.insert_transactions(body, id);
        res.status(200).json({ inserted });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  }
);

router.patch(
  "/transaction/:userId/:tranId",
  paramCheck.idAndBody,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const body = req.body;
    const id = req.params.userId;
    const tranId = req.params.tranId;

    try {
      const update = await qs.editTransaction(body, id, tranId);
      res.status(201).json({ update });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get(
  "/transaction/:userId",
  paramCheck.onlyId,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const id = req.params.userId;
    try {
      const categories = await qs.MANUAL_get_categories(id);
      const list = categories.filter(cat => {
        if (cat != null) {
          return cat;
        }
      });
      res.status(200).json({ list });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.post(
  "/categories/:userId",paramCheck.idAndBody,paramCheck.userExists,paramCheck.tokenMatchesUserId, paramCheck.CatAlreadyLinked, async (req, res) => {
    const id = req.params.userId
    const body = req.body

    try{
      const addedCat = await qs.insert_categories(body, id)
      res.status(201).json({addedCat})
    }catch(err){
      console.log(err)
      res.status(500).json(err)
    }
  }
);

router.patch(
  "/categories/:userId/:catId",
  paramCheck.idAndBody,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  paramCheck.defaultCategory,
  async (req, res) => {
    const id = req.params.userId;
    const body = req.body;

      try {
        const updated = await qs.editCategory(body, catId, id);
        if (updated) {
          res.status(201).json({ updated });
        } else {
          res
            .status(400)
            .json({ message: "somthing went wrong, check the logs" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
    
  }
);

router.delete(
  "/transaction/:userId/:tranId",
  paramCheck.onlyId,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const id = req.params.tranId;

    try {
      const deleted = await qs.deleteTransaction(id);
      res.status(200).json({ deleted });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);

router.delete(
  "/categories/:userId/:catId",
  paramCheck.onlyId,
  paramCheck.userExists,
  paramCheck.tokenMatchesUserId,
  paramCheck.defaultCategory,
  async (req, res) => {

    const catId = req.params.catId
    
      try {
        const deleted = await qs.deleteCategory(catId);
        res.status(200).json({ deleted });
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
   
  }
);

module.exports = router;
