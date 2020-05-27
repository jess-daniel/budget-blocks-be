exports.up = function (knex) {
  return knex.schema.createTable('plaid_token', (tbl) => {
    tbl.increments();
    tbl.string('access_token').unique().notNullable();
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('plaid_token');
};
