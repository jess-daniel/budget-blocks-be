exports.up = function (knex) {
  return knex.schema.createTable('income', (tbl) => {
    tbl.increments();
    tbl.integer('income').notNullable();
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('income');
};
