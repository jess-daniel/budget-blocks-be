const jwt = require("jsonwebtoken");

exports.idAndBody = (req,res,next)=>{
    const body = req.body
    const id = req.params.userId
  
    if (!id || !body) {
      res.status(400).json({message:"please add a parameter at the end of the endpoint and a body to the request"});
    }else{
        next()
    }
}

exports.onlyId=(req,res,next)=>{
    const body = req.body
    const id = req.params.userId
  
    if (!id) {
      res.status(400).json({message:"please add a parameter at the end of the endpoint"});
    }else{
        next()
    }
}

// Checks if the params that are passed match to the header that is being passed
exports.tokenMatchesUserId = (req,res,next)=>{
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