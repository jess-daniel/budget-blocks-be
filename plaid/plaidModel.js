const db = require("../data/db-config.js");

const data = require("./data.js");

//accessed by the token exchange endpoint. It saves the access token we get from Plaid into the database
const add_A_Token = (token, Userid) => {
  return db("users_accessToken")
    .returning("id")
    .insert({ access_token: token, user_id: Userid })
    .then(ids => {
      return ids[0];
    })
    .catch(error => console.log(error));
};

//accessed by the token exchange endpoint. It saves the "item" we get from Plaid into the database
const add_An_Item = (Itemid, Userid) => {
  return db("item")
    .returning("id")
    .insert({ item_id: Itemid, user_id: Userid })
    .then(ids => {
      return ids[0];
    })
    .catch(error => console.log(error));
};

//Reserved strictly for the below function: insert_transactions
const sortCategory = TransactionItem => {
  var i;
  for (i = 0; i <= data.length - 1; i++) {
    let found = data[i].codes.find(code => {
      if (TransactionItem == code) {
        return code;
      } else {
        return null;
      }
    });

    if (found) {
      return data[i].id;
    }
  }
};

//This is used to insert transactions from plaid into our db. above function needed to parse the category id that plaid provides and filter it down to one of our 24 default categories.
const insert_transactions = (trans, Userid) => {
  return db("budget_item")
    .returning("id")
    .insert({
      name: trans.name,
      amount: trans.amount,
      payment_date: trans.date,
      category_id: sortCategory(trans.category_id),
      user_id: Userid,
      account_id: trans.account_id
    });
};

//used to link a user_id to the categoryId.
const link_user_categories = (Categoryid, Userid) => {
  return db("user_category").insert({
    category_id: Categoryid,
    user_id: Userid
  });
};

//reserved for PLAID middleware
const getAccessToken = Userid => {
  return db("db")
    .select("access_token")
    .from("users_accessToken")
    .where({ user_id: Userid })
    .first();
};

const WEB_get_pg_itemid = plaidItemId => {
  return db("db")
    .select("id")
    .from("item")
    .where("item_id", plaidItemId)
    .first();
};

const WEB_get_userID = plaidItemId => {
  return db("db")
    .select("users.id")
    .from("item")
    .join("users", "item.user_id", "users.id")
    .where("item.item_id", plaidItemId)
    .first();
};
//reserved for error logging,under no circumstances will we use this for the front end
const WEB_get_all_item_data = () => {
  return db("db")
    .select("*")
    .from("item");
};

const WEB_track_insertion = (pgItemId, status) => {
  return db("item_insertions")
    .returning("id")
    .insert({ pg_item_id: pgItemId, status: status })
    .then(ids => {
      return ids[0];
    })
    .catch(error => console.log(error));
};

const WEB_get_accessToken = plaidItemId => {
  return db("db")
    .select("at.access_token")
    .from("item")
    .join("users as u", "item.user_id", "u.id")
    .join("users_accessToken as at", "u.id", "at.user_id")
    .where("item.item_id", plaidItemId)
    .first();
};

const WEB_insert_transactions = async (list, Userid) => {
  try {
    return Promise.all(
      list.map(async trans => {
        try {
          const yeet = await insert_transactions(trans, Userid);
          return { ...trans, yeet: "done" };
        } catch (error) {
          console.log(error);
        }
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const INFO_get_status = Userid => {
  return db("db")
    .select("*")
    .from("users")
    .join("item as i", "users.id", "i.user_id")
    .join("item_insertions as II", "i.id", "II.pg_item_id")
    .where("users.id", Userid)
    .orderBy("II.id", "desc")
    .first();
};

//reserved for the function below it
const INFO_get_cat_transactions = (categoryID, userID) => {
  return db("db")
    .select("*")
    .from("budget_item")
    .where({ category_id: categoryID, user_id: userID });
};

//reserved for the function below it
const INFO_get_cat_manual_transactions = (categoryID, userID) => {
  return db("db")
    .select("*")
    .from("manual_budget_item")
    .where({ category_id: categoryID, user_id: userID });
};

//reserved for the function below it
const INFO_get_amount_by_category = (categoryID, userID) => {
  return db("budget_item")
    .sum({ total: "amount" })
    .where({ category_id: categoryID, user_id: userID })
    .first();
};

//reserved for the function below it
const INFO_get_manual_amount_by_category = (categoryID, userID) => {
  return db("manual_budget_item")
    .sum({ total: "amount" })
    .where({ category_id: categoryID, user_id: userID })
    .first();
};

const INFO_get_categories = Userid => {
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
              const trans = await INFO_get_cat_transactions(cat.id, Userid)
              const manualTrans = await INFO_get_cat_manual_transactions(cat.id, Userid)
              const amount = await INFO_get_amount_by_category(cat.id, Userid)
              const manualAmount = await INFO_get_manual_amount_by_category(cat.id, Userid)
              const trueTotal = Number(amount.total)+Number(manualAmount.total)
              if (trans.length > 0 || manualTrans.length > 0) {
                return { ...cat, transactions: trans, manualTransactions:manualTrans, 
                  total: trueTotal};
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
};

const insert_accounts = (body, pgItemId) => {
  return db("bank_account")
    .returning("id")
    .insert({
      account_id: body.account_id,
      balance: body.balances.available
        ? body.balances.available
        : body.balances.current,
      official_name: body.official_name ? body.official_name : body.name,
      subtype: body.subtype,
      type: body.type,
      mask: body.mask,
      pg_item_id: pgItemId
    });
};

const PLAID_insert_accounts = async (accounts, pgItemId) => {
  try{
    return Promise.all(
      accounts.map(async acct => {
        try {
          const yate = await insert_accounts(acct, pgItemId);
          return { ...acct, yeet: "done" };
        } catch (error) {
          console.log(error);
        }
      })
    )
  }catch(err){
    console.log(err)
  }
};

const PLAID_get_pg_item_id = userID => {
  return db("db")
    .select("i.id")
    .from("users")
    .join("item as i", "users.id", "i.user_id")
    .where("users.id", userID)
    .first();
};

const PLAID_get_accounts = pgItemId => {
  return db("db")
    .select("*")
    .from("bank_account")
    .where("pg_item_id", pgItemId);
};

const update_accounts = body => {
  return db("bank_account")
    .returning("id")
    .update({
      account_id: body.account_id,
      balance: body.balances.available
        ? body.balances.available
        : body.balances.current,
      official_name: body.official_name ? body.official_name : body.name,
      subtype: body.subtype,
      type: body.type,
      mask: body.mask
    })
    .where({ account_id: body.account_id });
};

const PLAID_update_accounts = accounts => {
  return Promise.all(
    accounts.map(async acct => {
      try {
        const yate = await update_accounts(acct);
        return { ...acct, yeet: "done" };
      } catch (error) {
        console.log(error);
      }
    })
  );
};

module.exports = {
  add_A_Token,
  add_An_Item,
  insert_transactions,
  link_user_categories,
  getAccessToken,
  WEB_get_pg_itemid,
  WEB_get_userID,
  WEB_track_insertion,
  WEB_get_accessToken,
  WEB_insert_transactions,
  WEB_get_all_item_data,
  INFO_get_status,
  INFO_get_categories,
  PLAID_insert_accounts,
  PLAID_get_pg_item_id,
  PLAID_get_accounts,
  PLAID_update_accounts
};
