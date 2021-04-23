const request = require('supertest')

const server = require('./server.js')
const db = require('../data/dbConfig.js')

test('sanity', () => {
  expect(true).not.toBe(false)
})

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach( async () => {
  await db.seed.run()
})

describe('/api/auth', () => {
  describe('/register', () => {
    const path = '/api/auth/register'
    it('fails if username or password not provided', async () => {
      let res = await request(server).post(path).send({})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post(path).send({username: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post(path).send({password: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
    })
    it('fails if username not unique', async () => {
      let res = await request(server).post(path).send({ username: 'bobby', password: 'aoeu' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username taken')
    })
    it('sends new user back', async () => {
      let res = await request(server).post(path).send({ username: 'newUser', password: 'aoeu' })
      
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id', 2)
      expect(res.body).toHaveProperty('username', 'newUser')
      expect(res.body).toHaveProperty('password') // don't know what the hash will look like
    })
    it('adds user to table', async () => {
      await request(server).post(path).send({ username: 'newUser', password: 'aoeu' })

      let res = await request(server).post(path).send({ username: 'newUser', password: 'aoeu' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username taken')
    })
  })
  describe('/login', () => {
    const path = '/api/auth/login'
    it('fails if username or password not provided', async () => {
      let res = await request(server).post(path).send({})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post(path).send({username: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post(path).send({password: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
    })
    it('fails if bad username', async () => {
      let res = await request(server).post(path).send({username: 'badusername', password: 'aoeu'})
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('invalid credentials')
    })
    it('fails if bad password', async () => {
      let res = await request(server).post(path).send({username: 'bobby', password: 'badpassword'})
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('invalid credentials')
    })
    it('sends token and proper on success', async () => {
      let res = await request(server).post(path).send({username: 'bobby', password: 'aoeu'})
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Welcome, bobby')
      expect(res.body).toHaveProperty('token')
    })
  })
})

describe('/api/jokes', () => {
  const path = '/api/jokes'
  describe('auth', () => {
    it('fails when no token provided', async () => {
      let res = await request(server).get(path)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('token required')
    })
    it('fails on invalid token', async () => {
      let res = await request(server).get(path).set('Authorization', 'badToken')
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('token invalid')
    })
  })
  describe('jokes', () => {
    const jokes = require('./jokes/jokes-data.js')
    let loginRes
    let token
    beforeEach( async () => {
      loginRes = await request(server).post('/api/auth/login').send({username: 'bobby', password: 'aoeu'})
      token = loginRes.body.token
    })
    it('returns jokes', async () => {
      let res = await request(server).get(path).set('Authorization', token)
      expect(res.body).toEqual(jokes)
    })
  })
})
