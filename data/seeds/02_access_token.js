exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('plaid_token')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('plaid_token').insert([
        { id: 1, access_token: '1234d5sa32es$32s', user_id: 1 },
      ]);
    });
};
