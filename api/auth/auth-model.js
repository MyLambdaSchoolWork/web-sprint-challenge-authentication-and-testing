const db = require('../../data/dbConfig.js')

module.exports = {
  getById,
  getByUsername,
  insert
}

function getById(id){
  return db('users')
    .where({id})
    .first()
}

function getByUsername(username){
  return db('users')
    .where({username})
    .first()
}

async function insert(user){
  const [id] = await db('users').insert(user)
  return getById(id)
}
