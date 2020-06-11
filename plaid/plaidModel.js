const db = require("../data/db-config.js");

//accessed by the token exchange endpoint. It saves the access token we get from Plaid into the database
const plaid_access = (token, id) => {
  return db("plaid_token")
    .insert({ access_token: token, user_id: id }, "id")
    .then((ids) => {
      return ids[0];
    })
    .catch((error) => res.status(500).json({ error: error }));
};

function findToken(token) {
  return db("plaid_token").where({ access_token: token });
}

// Find Token by User Id
function findTokensByUserId(user_id) {
  return db("plaid_token").where({ user_id })
}

// Find All Tokens
function findAllTokens() {
  return db("plaid_token");
}

// Delete Token by User Id
function deleteTokenByUserId(user_id, id) {
  return db("plaid_token").where({ user_id, id }).del();
}

function deleteAllTokensByUserId(user_id) {
  return db("plaid_token").where({ user_id }).del();
}

module.exports = {
  plaid_access,
  findTokensByUserId,
  deleteTokenByUserId,
  findAllTokens,
  findToken,
  deleteAllTokensByUserId,
};
