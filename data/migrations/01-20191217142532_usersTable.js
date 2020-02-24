exports.up = function(knex) {
  return (
    knex.schema.createTable("users", tbl => {
        tbl.increments();

        tbl
          .string("email")
          .notNullable()
          .unique();

        tbl.string("password").notNullable();

        tbl.decimal('income')
        .nullable();

        tbl.decimal('saving_goal')
        .nullable();

        tbl.string('first_name')
        .notNullable();

        tbl.string('last_name')
        .notNullable();
      })

      // Creates a reference table so that an access token can be mapped to a specific user_id
      // One user can have multiple access_tokens depending upon how many bank accts they sync
      .createTable("users_accessToken", tbl => {
        tbl.increments();

        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");

        tbl.string("access_token");
      })
  );
};





exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};