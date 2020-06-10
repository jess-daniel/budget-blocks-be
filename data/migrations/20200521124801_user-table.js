exports.up = function (knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.string('name').notNullable();
    tbl.string('email').notNullable().unique();
    tbl.string('city');
    tbl.string('state');
    tbl.boolean('onboarding_complete').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
