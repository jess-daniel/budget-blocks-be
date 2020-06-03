exports.up = function (knex) {
  return knex.schema.createTable('plaid_token', (tbl) => {
    tbl.increments();
    tbl.string('access_token').unique().notNullable();
    tbl.string('bank_name');
    tbl.datetime('latest_plaid_fetch');
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
