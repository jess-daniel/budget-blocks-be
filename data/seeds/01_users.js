exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'Edward Blanciak',
          email: 'budgetblocks@gmail.com',
        },
        {
          id: 2,
          name: 'Joe Smith',
          email: 'JoeSmith@gmail.com',
        },
      ]);
    });
};
