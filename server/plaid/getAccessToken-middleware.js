const qs = require('./plaidModel.js');

//checks to see
module.exports = (req, res, next) => {

  const id = req.params.id;

  if(!id){
    res.status(400).json({message:'please add a param to the end of the endpoint'})
  }else{
    console.log("ID THAT SHOULD FAIL", id)
    qs.getAccessToken(id)
      .then(access => {
        if (access) {
          req.body.access = access.access_token;
          next();
        } else {
          res
            .status(404)
            .json({message: 'No access_Token found for that user id provided'});
        }
      })
  
      .catch(err => {
        console.log(err);
        res.status(500).json({message: 'big error on server brother'});
      });
  }
};
