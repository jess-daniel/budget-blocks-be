const server = require('./server.js');
const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(
    `\n*** Server is running at http://localhost:${PORT}... ***\n`
  );
});
