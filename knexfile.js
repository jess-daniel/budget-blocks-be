// // Update with your config settings.
require('dotenv').config();

module.exports = {
  //   development: {
  //     client: "sqlite3",
  //     useNullAsDefault: true,
  //     connection: {
  //       filename: "./data/users.db3"
  //     },
  //     seeds: {
  //       directory: "./data/seeds"
  //     },
  //     migrations: {
  //       directory: "./data/migrations"
  //     },
  //     pool: {
  //       afterCreate: (conn, done) => {
  //         conn.run("PRAGMA foreign_keys = ON", done);
  //       }
  //     }
  //   },
  //   production: {
  //     client: "pg",
  //     connection: process.env.DATABASE_URL,
  //     migrations:{
  //       directory: "./data/migrations"
  //     },
  //     seeds:{
  //       directory:"./data/seeds"
  //     }
  //   }
  // development: {

  // client: "sqlite3",

  // useNullAsDefault: true,

  // connection: {

  // filename: "./data/users.db3"

  // },

  // seeds: {

  // directory: "./data/seeds"

  // },

  // migrations: {

  // directory: "./data/migrations"

  // },

  // pool: {

  // afterCreate: (conn, done) => {

  // conn.run("PRAGMA foreign_keys = ON", done);

  // }

  // }

  // },

  development: {

    client: "pg",

    connection: process.env.DEV_DATABASE_URL,

    migrations: {

      directory: "./data/migrations"

    },

    seeds: {

      directory: "./data/seeds"

    }

  },
  test: {

    client: "pg",

    connection: process.env.TEST_DATABASE_URL,

    migrations: {

      directory: "./data/migrations"

    },

    seeds: {

      directory: "./data/seeds"

    }

  },


};


