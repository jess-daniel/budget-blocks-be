const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {authorization} = req.headers;
  // Check if their is any auth headers and attempt to verify the token, if not return an error
  if (authorization) {
    const secret = process.env.JWT_SECRET || 'secretkey';

    // Verifies the token and uses a cb function to check if the token is valid
    jwt.verify(authorization, secret, function(error, validToken) {
      if (error) {
        res.status(401).json({error: 'Invalid token.'});
      } else {
        req.token = validToken;
        next();
      }
    });
  } else {
    res
      .status(404)
      .json({error: 'You must be logged in to access this information.'});
  }
};
