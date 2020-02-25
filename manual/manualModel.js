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
                if (cat.budget != null) {
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

const link_user_and_category = (categoryId, userId, bud)=>{
  return db ('user_category')
  .insert({category_id:categoryId, user_id:userId, budget:bud})
}

const insert_categories = (body, userId)=>{
  return db('category')
  .insert({name:body.name}, 'id')
  .then(async(ids)=>{
    try{
      const link = await link_user_and_category(ids[0], userId, body.budget)
    }catch(err){
      console.log(err)
    }
    return ids[0]
  })
  .catch(err=>{
    console.log(err)
  })
}

const find_category_by_name = (body, userId)=>{
  return db('db')
  .select("*")
  .from('category')
  .where({name:body.name})
  .first()
  .then(async(category)=>{
    try{
      const link = await link_user_and_category(category.id, userId, body.budget)
    }catch(err){
      console.log(err)
    }
    return category.id
  })
  .catch(err=>{
    console.log(err)
  })
}

//reserved for the function below it

const search_link=(catId, userId)=>{
  return db('db')
  .select('*')
  .from('user_category')
  .where({category_id:catId, user_id:userId})
  .first()
}

const category_already_linked = (body, userId)=>{
  return db('db')
  .select("*")
  .from('category')
  .where({name:body.name})
  .first()
  .then(async category =>{
    if(category){
      try{
        const linked = await search_link(category.id, userId)
        if(linked){
          return linked
        }else{
          return null
        }
      }catch(err){
        console.log(err)
        return null
      }
    }
  })
  .catch(err=>{
    console.log(err)
  })
}

const editCategoryBudget = (catid, userid, bud)=>{
  return db('user_category')
  .where({category_id:catid, user_id:userid})
  .update({budget:bud})
}


const editCategory = (body, catId, userId)=>{
  return db('category')
  .where({id:catId})
  .update({name:body.name}, "id")
  .then(async(ids)=>{
    if(body.budget){
      try{
        const yeet = await editCategoryBudget(catId, userId, body.budget)
        return ids[0]
      }catch(err){
        console.log(err)
      }
    }else{
      return ids[0]
    }
  })
}

const deleteTransaction = (tranId)=>{
  return db('manual_budget_item')
  .where({id:tranId})
  .del()
}

const deleteCategory = (catId)=>{
  return db('category')
  .where({id:catId})
  .del()
}

module.exports = {
    insert_transactions,
    editTransaction,
    getAllTrans,
    MANUAL_get_categories,
    insert_categories,
    editCategory,
    deleteTransaction,
    deleteCategory,
    find_category_by_name,
    category_already_linked
}