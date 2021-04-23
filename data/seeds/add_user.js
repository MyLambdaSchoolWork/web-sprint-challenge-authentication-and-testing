const bcrypt = require('bcrypt')

exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('users').truncate()
    // Inserts seed entries
  return knex('users').insert([
    { username: 'bobby', password: bcrypt.hashSync('aoeu', 8)}
  ])
}
