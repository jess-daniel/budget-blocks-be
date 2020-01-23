const db = require('../data/db-config');

module.exports = {
  allUsers,
  addUser,
  findUserBy,
};

function allUsers() {
  return db('users');
}

function addUser(userData) {
  return db('users')
    .insert(userData, 'id')
    .then(ids => {
      const [id] = ids;

      return findUserBy({id});
    });
}

function findUserBy(filter) {
  return db('users')
    .select('id', 'username', 'password')
    .where(filter)
    .first();
}
