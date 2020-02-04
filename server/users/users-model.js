const db = require('../data/db-config');

module.exports = {
  allUsers,
  addUser,
  findUserBy,
  login,
  checkAccessToken,
  returnUserCategories,
};

function allUsers() {
  return db('users');
}

function addUser(userData) {
  return db('users')
    .insert(userData, 'id')
    .then(ids => {
      //took out the call to the findbyUser function, I thought we talked about just returning the user id
      return ids[0];
    });
}

//Middlewhere
function findUserBy(filter) {
  return db('users')
    .select('id', 'email')
    .where(filter)
    .first();
}

//This is the login, searching just by email works since all emails are unique(Gmail duh) and in our own database the email column is set to unique

//This is to check if the user that logged in has a access_token.
function login(Cred) {
  return db('users')
    .select('id', 'email', 'password')
    .where({email: Cred.email})
    .first()
    .then(async user => {
      const good = await checkAccessToken(user.id);
      if (good) {
        return (user = {...user, LinkedAccount: true});
      } else {
        return (user = {...user, LinkedAccount: false});
      }
    });
}

//This is to check if the user that logged in has a access_token.
function checkAccessToken(UserID) {
  return db('db')
    .select('*')
    .from('users_accessToken')
    .where({user_id: UserID})
    .first();
}

// Returns the categories based upon the userId.
function returnUserCategories(userId) {
  return db('db')
  .select('c.id', 'c.name', 'users.email', 'uc.budget')
  .from('users')
  .join('user_category as uc', 'users.id', 'uc.user_id')
  .join('category as c', 'uc.category_id', 'c.id')
  .where('users.id', Userid)
}
