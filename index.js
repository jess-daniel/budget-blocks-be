const server = require("./data/server.js");
const PORT = process.env.PORT || 5000;
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://c0e164d7a07b4f54854d29fc3c62f50f@sentry.io/5167996' });

server.listen(PORT, () => {
  console.log(`\n*** Server running at http://locahost:${PORT}... ***\n`);
});
