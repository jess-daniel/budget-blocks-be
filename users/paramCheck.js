const jwt = require("jsonwebtoken");
const Users = require("./users-model.js");
const Manual = require('../manual/manualModel.js');

exports.idAndBody = (req, res, next) => {
  const body = req.body;
  const id = req.params.userId;

  if (!id || !body || isNaN(id)) {
    res
      .status(400)
      .json({
        message:
          "please add a parameter at the end of the endpoint and a body to the request"
      });
  } else {
    next();
  }
};

exports.onlyId = (req, res, next) => {
  const id = req.params.userId;

  if (!id || isNaN(id)) {
    res
      .status(400)
      .json({ message: "please add a parameter at the end of the endpoint" });
  } else {
    next();
  }
};

// Checks if the params that are passed match to the header that is being passed
exports.tokenMatchesUserId = (req, res, next) => {
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
};

// Middleware to check if a specified userId exists
exports.userExists = (req, res, next) => {
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
};

exports.CatAlreadyLinked = async (req,res,next)=>{
  let id = req.params.userId;
  let body = req.body;

  try{
    const yeet = await Manual.category_already_linked(body, id)
    if(yeet){
      res.status(400).json({message:'You are already linked to this category'})
    }else{
      next()
    }
  }catch(err){

  }
}

exports.defaultCategory = (req,res,next)=>{
  let catId = req.params.catId;

  if(catId > 24){
    next()
  }else{
    res.status(400).json({message:'You just tried to delete/update a default category'})
  }

}
