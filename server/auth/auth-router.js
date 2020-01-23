const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');

function validateUserCredentials(req, res, next) {
  // Checks if the body is empty before sending back errors to the client
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({error: 'No information was passed into the body.'});
  } else {
    // start the more specific requests to provide better error handling
    if (!req.body.username) {
      res.status(400).json({error: 'Please provide a username.'});
    } else if (!req.body.password) {
      res.status(400).json({error: 'Please provide a password.'});

      // If no errors are found, move onto the actual endpoint
    } else {
      next();
    }
  }
}

function userAlreadyExists(req, res, next) {
  let username = req.body.username;

  // Searches the database for the username that was passed in
  Users.findUserBy({username})
    .then(response => {
      // If we get a response, we know that a user with that unique username already exists so return an error.
      // If no user is found, allow the endpoint to be accessed
      if (response) {
        res.status(400).json({error: 'That username already exists.'});
      } else {
        next();
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({error: 'Unable to find the user with the username provided.'});
    });
}

router.post(
  '/register',
  [userAlreadyExists, validateUserCredentials],
  (req, res) => {
    let user = req.body;

    // hashes the password prior to sending it over to the client
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    Users.addUser(user)
      .then(response => {
        // The response is set to return back the newly created user
        res.status(201).json(response);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({error: 'Unable to create a new user.'});
      });
  },
);

router.post('/login', validateUserCredentials, (req, res) => {
  let {username, password} = req.body;

  Users.findUserBy({username})
    .first()
    .then(user => {
      // Need to grab the password of the username that was used to login, and check if the hashed password and the password the user provided match
      // If the user matches, sets a session of the user object to allow access to restricted routes
      if (user && bcrypt.compareSync(password, user.password)) {
        // saves a session for the user credentials
        req.session.user = user;

        // sets a header authorization token
        const token = signToken(user);
        res.set('authorization', token);

        res.status(200).json({token, message: `Welcome ${user.username}`});
      } else {
        res.status(401).json({message: 'Invalid credentials were provided.'});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'Unable to find the user by the username provided.',
      });
    });
});

router.get('/logout', (req, res) => {
  // check if a sessions exists so that it can be destroyed
  if (req.session.user) {
    // If their was an error while destroying the session, let the user no, if not, provide them with a success message
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({error: 'Their was an error logging you out.'});
      } else {
        res.status(200).json({message: 'You have been logged out.'});
      }
    });
    // If no session exists, just end the request
  } else {
    res.status(200).end();
  }
});

function signToken(user) {
  const payload = {
    user_id: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET || 'secretkey';

  const options = {
    expiresIn: '1h',
  };

  // returns the token so that it can be sent back to the client
  return jwt.sign(payload, secret, options);
}

module.exports = router;
