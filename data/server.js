// Imports all the protective middleware to validate for routes
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const graphqlHTTP = require("express-graphql");
const authenticate = require("../auth/restricted-middleware");

// user Routes
const authRouter = require("../auth/auth-router");
const userRouter = require("../users/users-router");
const plaidRouter = require("../plaid/plaidRouter.js");
const webhookRouter = require("../webhook/webhookModel");
const manualRouter = require("../manual/manualRouter.js");

// Server initialization
const knex = require("./db-config");
const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan("dev"));

server.use(
  "/graphql",
  graphqlHTTP({
    // TODO: create schema
    graphql: true
  })
);

server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);
//make sure this endpoint it handled by its own router
server.use("/plaid/webhook", webhookRouter);
server.use("/plaid", authenticate, plaidRouter);
server.use('/manual', manualRouter);

server.use("/", (req, res) => {
  res.send({ message: "API is up and running..." });
});

module.exports = server;
