const db = require('../../data/db-config');

function addIncome(value, id) {
  return db('income')
    .insert({ income: value, user_id: id }, 'id')
    .then((ids) => {
      [id] = ids;
      return findIncomeById(id);
    });
}

function findIncomeById(id) {
  return db('income').where({ id }).first();
}

module.exports = {
  addIncome,
  findIncomeById,
};
