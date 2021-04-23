const { getByUsername } = require('./auth-model.js')

module.exports = {
  checkParamsPresent,
  checkUsernameUnique,
  checkUserExists
}

function checkParamsPresent(req, res, next){
  const { username, password } = req.body

  const usernameIsString = typeof(username) === 'string'
  const passwordIsString = typeof(password) === 'string'

  usernameIsString && passwordIsString
    ? next()
    : next({ status: 400, message: 'username and password required'})
}

async function checkUserExists(req, res, next){
  const user = await getByUsername(req.body.username)
  if(user){
    req.user = user
    next()
  } else {
    next({ status: 401, message: 'invalid credentials'})
  }
}

async function checkUsernameUnique(req, res, next){
  const user = await getByUsername(req.body.username)
  !user
    ? next()
    : next({ status: 400, message: 'username taken'})
}
