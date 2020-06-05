const db = require('../../data/db-config.js')

module.exports = {
    findAll,
    findById,
    add,
    update,
    remove
}

function findAll(){
    return db('budget_goals')
    
}

function findById(id) {
    return db('budget_goals')
        .where({ id })
        .first()
}

function add(data){
    return db('budget_goals')
        .insert(data)
}

function update(changes, id){
    return db('budget_goals')
        .update(changes)
        .where({ id })
}

function remove(id){
    return db('budget_goals')
        .where({ id })
        .del()
}