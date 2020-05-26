const db = require('../test_data/db-config');

module.exports = {
  findUserByEmail,
  addUser,
  deleteUser,
  findMessagesById,
  findAllUsers,
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
function findMessagesById(user_id) {
  return db('messages').where({ user_id }).first();
}

// NOTE Test Helper Fxn (delete later)
function findAllUsers() {
  return db('users');
}
