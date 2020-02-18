//Plaid model and data
const Plaid = require('../plaid/plaidModel.js');
const data = require('../plaid/data.js');
//user model and data
const paramCheck = require('../users/paramCheck.js')
const User = require('../users/users-model.js')

const express = require('express')
const router = express.Router()

router.get('/onboard/:userId',paramCheck.onlyId,paramCheck.userExists, paramCheck.tokenMatchesUserId, async(req,res)=>{

    const userid = req.params.userId

    //same thing as the plaid router. Just need to loop though a default categories and link them to the user thats opted for manual entry.
    const doneData = Promise.all(
        data.map(async d => {
          try {
            const contents = await Plaid.link_user_categories(d.id, userid);
            return d;
          } catch (error) {
            console.log(error);
          }
        })
      );

    const categories = await User.returnUserCategories(userid)

    res.status(200).json(categories)
})

module.exports = router;