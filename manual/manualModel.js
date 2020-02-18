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

const editTransaction = (body, userId, tranId)=>{
    return db('manual_budget_item')
    .where({id: tranId, user_id:userId})
    .update(body, 'id')
}

const getAllTrans = (userId)=>{
    return db('db')
    .select('*')
    .from('manual_budget_item')
    .where('user_id', userId)
}

//reserved for the function below it
const MANUAL_get_cat_transactions = (categoryID, userID) => {
    return db("db")
      .select("*")
      .from("manual_budget_item")
      .where({ category_id: categoryID, user_id: userID });
  };
  //reserved for the function below it
  const MANUAL_get_amount_by_category = (categoryID, userID) => {
    return db("manual_budget_item")
      .sum({ total: "amount" })
      .where({ category_id: categoryID, user_id: userID })
      .first();
  };

const MANUAL_get_categories = Userid => {
    return db("db")
      .select("c.id", "c.name", "users.email", "uc.budget")
      .from("users")
      .join("user_category as uc", "users.id", "uc.user_id")
      .join("category as c", "uc.category_id", "c.id")
      .where("users.id", Userid)
      .then(async categories => {
        try {
          return Promise.all(
            categories.map(async cat => {
              try{
                const trans = await MANUAL_get_cat_transactions(cat.id, Userid);
                const amount = await MANUAL_get_amount_by_category(cat.id, Userid);
                if (trans.length > 0) {
                  return { ...cat, transactions: trans, total: amount.total };
                }
              }catch(err){
                console.log(err)
              }
            })
          );
        } catch (error) {
          console.log(error);
        }
      })
      .catch(error => console.log(error));
}

const link_user_and_category = (categoryId, userId)=>{

}

const insert_categories = (body, userId)=>{
  return db('category')
  .insert(body)
  .then(ids=>{
    return ids[0]
  })
  .catch(err=>{
    console.log(err)
  })
}

module.exports = {
    insert_transactions,
    editTransaction,
    getAllTrans,
    MANUAL_get_categories,
    insert_categories
}