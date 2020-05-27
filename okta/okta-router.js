const router = require('express').Router();
const dataBase = require('./okta-model');

// SECTION Middleware
const requireAuthentication = require('./middleware/require_authentication');

// SECTION TEST ENDPOINT
// router.post('/transactions', requireAuthentication, (req, res) => {
//   const email = req.body.email;
//   const user_id = req.body.id;

//   dataBase
//     .findUserByEmail(email)
//     .then((user) => {
//       if (user) {
//         dataBase
//           .findMessagesById(user_id)
//           .then((message) => {
//             if (user_id) res.status(200).json({ data: message });
//           })
//           .catch((err) => {
//             res.status(500).json({ error: err.message });
//           });
//       } else {
//         res.status(404).json({ error: 'user not found' });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// });

// SECTION TEST ENDPOINT
// Retrieve User by email
// router.post('/users', requireAuthentication, (req, res) => {
//   const email = req.body;

//   dataBase
//     .findUserByEmail(email)
//     .then((user) => {
//       res.status(200).json({ data: user });
//     })
//     .catch((err) => {
//       console.log(email);
//       res.status(500).json({ error: err.message });
//     });
// });

// NOTE SAVE THESE ENDPOINTS BELOW
// -------------------------------------------------

// SECTION GET -- Get All Users
router.get('/users', requireAuthentication, (req, res) => {
  dataBase
    .findAllUsers()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// SECTION POST - Add User
// Send Only Full Name & E-mail
// FIXME Needs to have more descriptive errors for missing fields
// FIXME May need to include the access token from plaid IF user exists
router.post('/users', requireAuthentication, (req, res) => {
  const oktaInfo = req.body;
  const userInfo = {
    name: oktaInfo.name,
    email: oktaInfo.email,
  };

  // const email = userInfo.email;

  dataBase
    .findUserByEmail(userInfo.email)
    .then((user) => {
      if (user) {
        res.status(200).json({ data: user });
      } else {
        dataBase
          .addUser(userInfo)
          .then((user) => {
            res.status(201).json({ data: user });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
            console.log(err.message);
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    });
});

// SECTION DELETE - Delete User
router.delete('/users', requireAuthentication, (req, res) => {
  const email = req.body.email;

  dataBase
    .deleteUser(email)
    .then(() => {
      res.status(200).json({ message: 'User successfully deleted!' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// SECTION PUT - Update User
router.put('/users', requireAuthentication, (req, res) => {});

module.exports = router;
