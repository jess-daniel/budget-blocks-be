// // Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    // connection: process.env.DEV_DATABASE_URL,
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      port: process.env.PG_PORT,
      password: process.env.PG_PASSWORD,
      database: 'test_db',
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      port: process.env.PG_PORT,
      password: process.env.PG_PASSWORD,
      database: 'test_db',
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  staging: {
    client: 'pg',
    connection: process.env.STAGING_DATABASE_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
};
