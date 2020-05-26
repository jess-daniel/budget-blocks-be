exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('messages')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('messages').insert([
        { id: 1, message: 'hi, eddie', user_id: 1 },
        { id: 2, message: 'hi mike', user_id: 2 },
      ]);
    });
};
