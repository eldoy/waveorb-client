const Socket from 'wsrecon'
const axios from 'axios'

const DEFAULT_OPTIONS = { reconnect: 1000, ping: 3000 }

module.exports = function(url, customOptions = {}) {
  const events = {}
  const options = Object.assign({}, DEFAULT_OPTIONS, customOptions)
  let socket
  // Connect to socket if it's
  if (/^wss?:\/\//.test(url)) {
    socket = new Socket(url, options)

    socket.on('open', async (event) => {
      console.log('Connection open')
      if (typeof events.open === 'function') {
        await events.open(event)
      }
    })

    socket.on('close', async (event) => {
      console.log('Connection closed')
      if (typeof events.close === 'function') {
        await events.close(event)
      }
    })

    socket.on('error', async (event) => {
      console.log('Connection error')
      if (typeof events.error === 'function') {
        await events.error(event)
      }
    })

    socket.on('message', async (data, event) => {
      console.log('Received message', data)
      if (typeof events.message === 'function') {
        await events.message(data, event)
      }
    })
  } // end if

  // Return the API object
  const database = function(path) {
    return async function (...data) {
      console.log({ data })
      let run
      let params = { db: { path, data } }
      if (socket) {
        run = await socket.fetch(params)
      } else {
        const config = {}
        console.log(data.constructor)
        if (path === 'uploads/insert') {
          console.log('HAVE UPLOAD')
          config.headers = {
            'content-type': 'multipart/form-data'
          }
          params = data[0]
        }
        run = (await axios.post(url, params, config)).data
        console.log({ run })
      }
      console.log(JSON.stringify(run.result))
      return run.result
    }
  }

  database.on = function(event, fn) {
    console.log('REGISTERING EVENT:', event)
    events[event] = fn
  }

  return database
}
