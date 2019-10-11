// Usage:
// const api = client('https://localhost:4000', {})
// const socket = client('wss://localhost:4000', { reconnect: true, ping: 3000 })

// Send through socket
// socket.fetch({
//   path: 'createProject',
//   data: {
//     values: {
//       name: 'nisse'
//     }
//   }
// })

// Send through http
// api.fetch({
//   path: 'createProject',
//   data: {
//     values: {
//       name: 'nisse'
//     }
//   }
// })

// Upload through api
// api.upload({ path: 'createProject' })

const ws = require('./lib/ws.js')
const http = require('./lib/http.js')

module.exports = function(host, options = {}) {
  const type = host.indexOf('ws') === 0 ? 'ws' : 'http'
  return type === 'http'
    ? http(host, options)
    : ws(host, { reconnect: true, ping: 3000, ...options })
}
