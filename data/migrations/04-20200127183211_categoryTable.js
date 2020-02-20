exports.up = function(knex) {
  return knex.schema.createTable('category', tbl => {
    tbl.increments();

    tbl
      .string('name', 160)
      .notNullable()
      .unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('category');
};
