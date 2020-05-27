const db = require('../data/db-config.js');

//accessed by the token exchange endpoint. It saves the access token we get from Plaid into the database
const plaid_access = (token, id) => {
  return db('plaid_access_token')
    .insert({ access_token: token, user_id: id})
    .then((ids) => {
      return ids[0];
    })
    .catch((error) => console.log(error));
};

module.exports = {
  plaid_access,
};
