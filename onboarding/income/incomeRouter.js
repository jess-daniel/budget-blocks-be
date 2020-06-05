const router = require('express').Router();
const Income = require('./incomeModel');

// Auth Middleware
const requireAuthentication = require('../../okta/middleware/require_authentication');
const validateIncome = require('./validateIncome');

// Routes
router.post('/income', requireAuthentication, validateIncome, (req, res) => {
  const { income, user_id } = req.body;
  console.log(req.body);
  Income.addIncome(income, user_id)
    .then((income) => {
      console.log(income);
      if (!income) {
        res.status(400).json({ message: 'There was a problem adding income' });
      } else {
        res.status(201).json({ data: income });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
