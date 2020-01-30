const router = require('express').Router();
const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

// Middleware to check if a specified userId exists
function userExists(req, res, next) {
  let id = req.params.userId;

  Users.findUserBy({id})
    .then(response => {
      // if a response is returned, the user exists so we can retrieve the list of catergories
      // Else, allow the next function to be passed
      if (response) {
        next();
      } else {
        res.status(400).json({error: 'The specified userId does not exist.'});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error:
          'Unable to retrieve the list of categories for the specified userId.',
      });
    });
}

router.get('/', restricted, (req, res) => {
  Users.allUsers()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({error: 'Unable to retrieve a list of users'});
    });
});

// Returns all of the categories for the userID that is passed. If no results are returned, that means the userID does not exist
router.get(`/categories/:userId`, userExists, (req, res) => {
  Users.returnUserCategories(req.params.userId)
    .then(categories => {
      if (categories.length > 0) {
        res.status(200).json(categories);
      } else {
        res
          .status(404)
          .json({message: 'The specified user ID does not exist.'});
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({message: 'Unable to return categories for the specified user.'});
    });
});

module.exports = router;
