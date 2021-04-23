const bcrypt = require('bcrypt')

exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('table_name').truncate()
    // Inserts seed entries
  return knex('table_name').insert([
    { username: 'bobby', password: bcrypt.hashSync('aoeu', 8)}
  ])
}
