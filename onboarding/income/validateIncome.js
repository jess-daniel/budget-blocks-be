const validateIncome = (req, res, next) => {
  const { income, user_id } = req.body;

  if (!income) {
    res.status(400).json({ message: 'Income value is required' });
  } else if (!user_id) {
    res.status(400).json({ message: 'User id is required' });
  } else {
    next();
  }
};

module.exports = validateIncome;
