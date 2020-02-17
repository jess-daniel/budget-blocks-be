const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");
const paramCheck = require("./paramCheck.js");

// Middleware to check if a specified userId exists
function userExists(req, res, next) {
  let id = req.params.userId;

  Users.findUserBy({ id })
    .then(response => {
      // if a response is returned, the user exists so we can retrieve the list of catergories
      // Else, allow the next function to be passed
      if (response) {
        next();
      } else {
        res.status(400).json({ error: "The specified userId does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error:
          "Unable to retrieve the list of categories for the specified userId."
      });
    });
}

// Checks if the params that are passed match to the header that is being passed
function tokenMatchesUserId(req, res, next) {
  let paramId = parseInt(req.params.userId);
  const { authorization } = req.headers;
  const secret = process.env.JWT_SECRET || "secretkey";

  // Verifies the token and then allows the endpoint to be accessed
  jwt.verify(authorization, secret, function(error, validToken) {
    if (error) {
      res.status(400).json({ error: "Not able to validate the user." });
    } else {
      if (paramId == validToken.user_id) {
        next();
      } else {
        res.status(403).json({
          error:
            "The user id you are trying to pass does not match with the web token."
        });
      }
    }
  });
}

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
  userExists,
  paramCheck.onlyId,
  tokenMatchesUserId,
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
  userExists,
  paramCheck.onlyId,
  tokenMatchesUserId,
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
  userExists,
  paramCheck.idAndBody,
  tokenMatchesUserId,
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
  userExists,
  paramCheck.idAndBody,
  tokenMatchesUserId,
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
  userExists,
  paramCheck.idAndBody,
  tokenMatchesUserId,
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

module.exports = router;
