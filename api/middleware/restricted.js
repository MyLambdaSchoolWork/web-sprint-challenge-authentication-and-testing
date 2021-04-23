const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../../secrets/secrets.js')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  console.log(req.headers)
  !token
    ? next({ status: 401, message: 'token required' })
    : jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
          next({ status: 401, message: `token invalid` })
        } else {
          req.decodedToken = decoded
          next()
        }
    })
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
}
