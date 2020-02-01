
exports.up = function(knex) {

    return knex.schema.createTable('item_insertions', tbl=>{

        tbl.increments();

        tbl.string('status')
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

    return knex.schema.dropTableIfExists('item_insertions')
  
};
