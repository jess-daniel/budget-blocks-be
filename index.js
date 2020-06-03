const server = require('./server.js');
<<<<<<< HEAD
const PORT = process.env.PORT || 4001;
=======
const PORT = process.env.APP_PORT || 4000;
>>>>>>> cd5b68d714f1360050ac8920ba68624cb11836ad

server.listen(PORT, () => {
  console.log(
    `\n*** Server is running at http://localhost:${PORT}... ***\n`
  );
});
