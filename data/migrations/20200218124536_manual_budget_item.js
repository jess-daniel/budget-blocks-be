exports.up = function(knex) {

    return knex.schema.createTable('manual_budget_item', tbl=>{

        tbl.increments();

        tbl.string('name')
        .nullable()

        tbl.decimal('amount')
        .notNullable();

        tbl.string('payment_date')
        .notNullable();
        
        tbl.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

        tbl.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('category')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('manual_budget_item')
};
