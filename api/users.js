const jsonServer = require('json-server')
const server = jsonServer.create()
const db = {
  users: [
    {
      "name": "Leo",
      "email": "muller.g@odalys-vacances.com",
      "role": "user",
      "status": "active",
      "id": 4
    },
    {
      "name": "Leonard",
      "email": "muller.g@old.com",
      "role": "admin",
      "status": "active",
      "id": 5
    }
  ]
}
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)

module.exports = server 