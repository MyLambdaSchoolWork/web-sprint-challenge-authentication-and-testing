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
    it('fails if username or password not provided', async () => {
      let res = await request(server).post().send({})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post().send({username: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
      
      res = await request(server).post().send({password: 'aoeu'})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username and password required')
    })
    it('fails if username not unique', async () => {
      let res = await request(server).post({ username: 'bobby', password: 'aoeu' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username taken')
    })
    it('sends new user back', async () => {
      let res = await request(server).post({ username: 'newUser', password: 'aoeu' })
      
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id', 2)
      expect(res.body).toHaveProperty('username', 'newUser')
      expect(res.body).toHaveProperty('password') // don't know what the hash will look like
    })
    it('adds user to table', async () => {
      await request(server).post({ username: 'newUser', password: 'aoeu' })

      let res = await request(server).post({ username: 'newUser', password: 'aoeu' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('username taken')
    })
  })
})
