exports.up = function (knex) {
  return knex.schema.createTable('messages', (tbl) => {
    tbl.increments();
    tbl.string('message').notNullable();
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('messages');
};
