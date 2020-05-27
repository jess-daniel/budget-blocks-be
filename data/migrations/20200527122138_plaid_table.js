exports.up = function (knex) {
  return knex.schema.createTable('plaid_token', (tbl) => {
    tbl.increments();
<<<<<<< HEAD:data/migrations/20200522160622_plaid_table.js

    tbl.string('access_token')
      .notNullable()
    
=======
    tbl.string('access_token').unique().notNullable();
>>>>>>> 2315447cfbf95e968eb0ecfb9d74c31978f08aa2:data/migrations/20200527122138_plaid_table.js
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
