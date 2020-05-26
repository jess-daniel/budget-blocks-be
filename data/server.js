// Imports all the protective middleware to validate for routes
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const graphqlHTTP = require('express-graphql');
const authenticate = require('../auth/restricted-middleware');

// user Routes
const authRouter = require('../auth/auth-router');
const userRouter = require('../old-users/users-router');
const plaidRouter = require('../old-plaid/plaidRouter.js');
const webhookRouter = require('../webhook/webhookModel');
const manualRouter = require('../manual/manualRouter.js');

// SECTION OKTA TEST ROUTER 5/20/20
const testRouter = require('../okta/test-router');

// Server initialization
const knex = require('./db-config');
const server = express();

const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.DSN });

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan('dev'));

server.use(
  '/graphql',
  graphqlHTTP({
    // TODO: create schema
    graphql: true,
  })
);

server.use('/api/auth', authRouter);
// server.use('/api/users', userRouter);
//make sure this endpoint it handled by its own router
server.use('/plaid/webhook', webhookRouter);
server.use('/plaid', authenticate, plaidRouter);
server.use('/manual', manualRouter);

// SECTION OKTA ROUTER USE
server.use('/api', testRouter);

// server.use('/', (req, res) => {
//   res.send({ message: 'API is up and running...' });
// });

module.exports = server;
