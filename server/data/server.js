// Imports all the protective middleware to validate for routes
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('dev');

// user Routes
const authRouter = require('../auth/auth-router');
const userRouter = require('../users/users-router');

// Server initialization
const knex = require('./db-config');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', userRouter);

server.use('/', (req, res) => {
  res.send({message: 'API is up and running...'});
});

module.exports = server;
