const db = require('../data/db-config.js');

const insert_transactions = (body, userId)=>{
    return db('manual_budget_item')
    .insert({
        name:body.name,
        amount:body.amount,
        payment_date:body.payment_date,
        user_id:userId,
        category_id:body.category_id
            }, 'id')
    .then(ids=>{
        return ids[0]
    })
    .catch(err=>{
        console.log(err)
    })
}

module.exports = {
    insert_transactions,
}