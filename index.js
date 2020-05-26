const server = require('./server.js');
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `\n*** Server is running at http://localhost:${PORT}... ***\n`
  );
});
