exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('plaid_access_token')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('plaid_access_token').insert([
        { id: 1, user_id: '1', access_token: '1245dsadcd143321dfcdas$32' },
      ]);
    });
};
