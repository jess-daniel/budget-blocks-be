// // Update with your config settings.
require('dotenv').config();

module.exports = {
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


