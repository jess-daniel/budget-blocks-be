exports.up = function (knex) {
  return knex.schema.createTable('budget_goals', (tbl) => {
    tbl.increments();
    tbl.integer('food');
    tbl.integer('housing');
    tbl.integer('personal');
    tbl.integer('income');
    tbl.integer('giving');
    tbl.integer('savings');
    tbl.integer('debt');
    tbl.integer('transfer');
    tbl.integer('transportation');
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('budget_goals');
};
