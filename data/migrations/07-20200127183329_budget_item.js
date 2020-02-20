

exports.up = function(knex) {
  return knex.schema.createTable('budget_item', tbl=>{

    tbl.increments();

    tbl.string('name', 255)
    .notNullable()

    tbl.decimal('amount')
    .notNullable()

    tbl.string('payment_date')
    
    tbl.integer('category_id')
    .unsigned()
    .references('id')
    .inTable('category')
    .notNullable()
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.integer('user_id')
    .unsigned()
    .references('id')
    .inTable('users')
    .notNullable()
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('account_id')
    .unsigned()
    .references('account_id')
    .inTable('bank_account')
    .notNullable()
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    // tbl.string('account_id')
    // .notNullable();


  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('budget_item')
};