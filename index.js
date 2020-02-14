const server = require('./data/server.js');
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n*** Server running at http://locahost:${PORT}... ***\n`);
});
