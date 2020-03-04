const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const router = require("express").Router();
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");
const paramCheck = require("./paramCheck.js");



router.get("/", restricted, (req, res) => {
  Users.allUsers()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ error: "Unable to retrieve a list of users" });
    });
});

router.get(
  "/user/:userId",
  paramCheck.userExists,
  paramCheck.onlyId,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const id = req.params.userId;

    try {
      const user = await Users.PLAID_find_user({ id });

      res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "cant get user right now" });
    }
  }
);

// Returns all of the categories for the userID that is passed. If no results are returned, that means the userID does not exist
router.get(
  `/categories/:userId`,
  paramCheck.userExists,
  paramCheck.onlyId,
  paramCheck.tokenMatchesUserId,
  (req, res) => {
    const id = req.params.userId;

    Users.returnUserCategories(id)
      .then(categories => {
        if (categories.length > 0) {
          res.status(200).json(categories);
        } else {
          res
            .status(404)
            .json({ message: "The specified user ID does not exist." });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "Unable to return categories for the specified user."
        });
      });
  }
);

router.put(
  "/categories/:userId",
  paramCheck.userExists,
  paramCheck.idAndBody,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const id = req.params.userId;
    const body = req.body;

    try {
      const update = await Users.editUserCategoryBudget(
        id,
        body.categoryid,
        body.budget
      );
      if (update) {
        res.status(202).json({
          userid: id,
          categoryid: body.categoryid,
          amount: body.budget,
          status: "true"
        });
      } else {
        res.status(400).json({
          userid: id,
          categoryid: body.categoryid,
          amount: body.budget,
          status: "false"
        });
      }
    } catch (err) {
      console.log("PUT CATEGORY ERR", err);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

router.put(
  "/income/:userId",
  paramCheck.userExists,
  paramCheck.idAndBody,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const body = req.body;
    const id = req.params.userId;

    try {
      const yeet = await Users.editUserIncome(id, body);
      res.status(201).json({ yeet });
    } catch (err) {
      res.status(500).json({ message: "somthing went wrong" });
    }
  }
);

router.put(
  "/savinggoal/:userId",
  paramCheck.userExists,
  paramCheck.idAndBody,
  paramCheck.tokenMatchesUserId,
  async (req, res) => {
    const body = req.body;
    const id = req.params.userId;

    try {
      const yeet = await Users.editUserSaving(id, body);
      res.status(201).json({ yeet });
    } catch (err) {
      res.status(500).json({ message: "smothing went wrong" });
    }
  }
);

router.delete("/user/:userId", paramCheck.userExists, paramCheck.onlyId, paramCheck.tokenMatchesUserId, async(req,res)=>{
  const id = req.params.userId

  try{
    const deleted = await Users.deleteUser(id)
    res.status(201).json({deleted})
  }catch(err){
    console.log(err)
    res.status(500).json({err})
  }


})

router.patch('/user/profile/:userId', paramCheck.userExists, paramCheck.onlyId, paramCheck.tokenMatchesUserId, async(req,res)=>{
  const id = req.params.userId
  const body = req.body

  try{
    if(body.password){
      const hashedPassword = await bcrypt.hash(body.password, 12)
      body.password = hashedPassword
    }
    const updated = await Users.edituserProfile(id, body)
    res.status(201).json({updated})
  }catch(err){
    console.log(err)
    res.status(500).json({message:'error on server'})
  }
})

module.exports = router;
