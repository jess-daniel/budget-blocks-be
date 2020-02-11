exports.up = function(knex) {

    return knex.schema.createTable('bank_account', tbl=>{

        tbl.increments();

        tbl.string('account_id')
        .notNullable()
        .unique();

        tbl.decimal('balance')
        .notNullable();

        tbl.string('official_name')
        .notNullable();

        tbl.string('subtype')
        .notNullable();

        tbl.string('type')
        .notNullable();

        tbl.string('mask')
        .notNullable();

        tbl.integer('pg_item_id')
        .unsigned()
        .references('id')
        .inTable('item')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('bank_account')
};