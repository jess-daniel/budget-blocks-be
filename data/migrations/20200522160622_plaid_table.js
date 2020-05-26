exports.up = function (knex) {
  return knex.schema.createTable('plaid_access_token', (tbl) => {
    tbl.increments();

    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    tbl.string('access_token');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('plaid_access_token');
};
