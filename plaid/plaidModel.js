const db = require('../data/db-config.js');

//accessed by the token exchange endpoint. It saves the access token we get from Plaid into the database
const plaid_access = (token, Userid) => {
  return db('users_accessToken')
    .returning('id')
    .insert({ access_token: token, user_id: Userid })
    .then((ids) => {
      return ids[0];
    })
    .catch((error) => console.log(error));
};

module.exports = {
  plaid_access,
};
