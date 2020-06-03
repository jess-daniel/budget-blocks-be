const server = require('./server.js');
const PORT = process.env.APP_PORT || 4000;

server.listen(PORT, () => {
  console.log(
    `\n*** Server is running at http://localhost:${PORT}... ***\n`
  );
});
