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
    if (!req.body.email) {
      res.status(400).json({error: 'Please provide an email.'});
    } else if (!req.body.password) {
      res.status(400).json({error: 'Please provide a password.'});

      // If no errors are found, move onto the actual endpoint
    } else {
      next();
    }
  }
}

function userAlreadyExists(req, res, next) {
  let email = req.body.email;
  // Searches the database for the username that was passed in
  Users.findUserBy({email})
    .then(response => {
      // If we get a response, we know that a user with that unique username already exists so return an error.
      // If no user is found, allow the endpoint to be accessed
      if (response) {
        res
          .status(400)
          .json({error: 'That email address has already been taken.'});
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

  let credentials = req.body;
  // console.log(email, password);
  Users.login(credentials)
    .then(user=>{
      bcrypt.compare(credentials.password, user.password,(err,response)=>{
        if(err){
          res.status(401).json({message:'Invalid credentials were provided'})
        }else{
          const token = signToken(user);
          res.status(200).json({
            token,
            message:`Welcome ${user.email}!`
          })
        }
      })
    })
    .catch(err=>{
      console.log(err)
      res.status(500).json({message:"Unable to find the user by the email provided"})
    })
});

function signToken(user) {
  const payload = {
    user_id: user.id,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || 'secretkey';

  const options = {
    expiresIn: '4h',
  };

  // returns the token so that it can be sent back to the client
  return jwt.sign(payload, secret, options);
}

module.exports = router;
