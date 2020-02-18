//Plaid model and data
const Plaid = require('../plaid/plaidModel.js');
const data = require('../plaid/data.js');
//user model and data
const paramCheck = require('../users/paramCheck.js')
const User = require('../users/users-model.js')

//manual model
const qs = require('./manualModel.js')

const express = require('express')
const router = express.Router()

router.get('/onboard/:userId',paramCheck.onlyId,paramCheck.userExists, paramCheck.tokenMatchesUserId, async(req,res)=>{

    const userid = req.params.userId
    try{

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
    }catch(err){
        console.log(err)
        res.status(500).json({err})
    }
})

router.post('/transaction/:userId', paramCheck.onlyId, paramCheck.userExists, paramCheck.tokenMatchesUserId, async(req,res)=>{
    const body = req.body
    const id = req.params.userId
    if(!body.amount || !body.payment_date || !body.category_id){
        res.status(401).json({message:'please send with the correct body'})
    }else{
        try{
            const yeet = await qs.insert_transactions(body, id)
            res.status(200).json({yeet})
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }

})

router.patch('/transaction/:userId', paramCheck.onlyId, paramCheck.userExists, paramCheck.tokenMatchesUserId, async(req,res)=>{
    const body = req.body
    

    if(!body.name|| !body.transactionId){
        res.status(401).json({message:'please add name/transaction id to object'})
    }else{
        try{
            const update = await qs.editTransaction(body)
            res.status(201).json({update})
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }
})

router.get('/transaction/:userId', async(req,res)=>{

    const id =req.params.userId
    try{
        const list = await qs.getAllTrans(id)
        res.status(200).json(list)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router;