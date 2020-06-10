const db = require('../data/db-config');

module.exports = {
  findUserByEmail,
  addUser,
  deleteUser,
  findAllUsers,
  updateUser,
};

// NOTE Save
function findUserByEmail(email) {
  return db('users').where({ email }).first();
}

// NOTE Save
function addUser(userInfo) {
  return db('users')
    .insert(userInfo, 'email')
    .then((emails) => {
      [email] = emails;

      return findUserByEmail(email);
    });
}

// NOTE Save
function deleteUser(email) {
  return db('users').where({ email }).del();
}

// NOTE Test Helper Fxn (delete later)
function findAllUsers() {
  return db('users');
}

function updateUser(city, state, onboarding_complete, userId) {
  return db('users')
    .where({ id: userId })
    .update({ city, state, onboarding_complete })
    .returning('*');
}
