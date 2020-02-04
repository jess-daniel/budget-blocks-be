const qs = require('./plaidModel.js');

//checks to see
module.exports = (req, res, next) => {

  const id = req.params.id;

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
};
