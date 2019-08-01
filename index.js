const Socket = require('wsrecon')
const axios = require('axios')

const SOCKET_OPTIONS = { reconnect: 1000, ping: 3000 }
const DEFAULT_CONFIG = { host: 'localhost:4000', ssl: false, ws: true }

module.exports = function(host, customConfig = {}) {
  const events = {}
  const subs = {}
  const config = Object.assign({}, DEFAULT_CONFIG, customConfig)

  // Find the URL for ws or http
  function url(type) {
    return `${type}${config.ssl ? 's' : ''}://${config.host}`
  }

  // Set up websocket
  let socket
  if (config.ws) {
    socket = new Socket(url('ws'), SOCKET_OPTIONS)
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
      const sub = data.result.sub
      if (sub) {
        console.log('SUB DATA')
        console.log(sub)
        await subs[sub.path](sub, event)
      } else if (typeof events.message === 'function') {
        await events.message(data.result, event)
      }
    })
  }

  function http(path) {
    return async function (...data) {
      console.log({ data })
      const params = { db: { path, data } }
      const config = {}
      const run = (await axios.post(url('http'), params, config)).data
      console.log({ run })
      console.log(JSON.stringify(run.result))
      return run.result
    }
  }

  function ws(path) {
    return async function (...data) {
      console.log({ data })
      const params = { db: { path, data } }
      const run = await socket.fetch(params)
      console.log(JSON.stringify(run.result))
      return run.result
    }
  }
  ws.on = function(event, fn) {
    console.log('REGISTERING EVENT:', event)
    events[event] = fn
  }

  function upload(path) {
    return function(options = {}) {
      return new Promise(function(resolve) {
        const input = document.createElement('input')
        input.type = 'file'
        input.value = null
        if (options.multiple) {
          input.multiple = true
        }
        if (options.accept) {
          input.accept = options.accept
        }
        async function change() {
          console.log('CHANGE')
          const files = input.files
          const params = new FormData()
          params.append('path', path)
          params.append('options', options)
          for (const file of files) {
            params.append('file', file, file.name)
          }
          const config = {
            headers: Object.assign(
              { 'content-type': 'multipart/form-data', 'cache-control': 'no-cache' },
              options.headers || {}
            )
          }
          if (options.progress) {
            config.onUploadProgress = function(event) {
              event.percent = Math.round((event.loaded * 100) / event.total)
              options.progress(event)
            }
          }
          const run = (await axios.post(url('http'), params, config)).data
          console.log({ run })
          console.log(JSON.stringify(run.result))
          resolve(run.result)
        }
        input.addEventListener('change', change)
        input.click()
      })
    }
  }

  function sub(paths) {
    return async function(options = {}) {
      if (options.message) {
        for (const path of paths) {
          subs[path] = options.message
        }
      }
      const params = { subs: paths }
      const run = await socket.fetch(params)
      console.log(JSON.stringify(run.result))
      return run.result
    }
  }

  return { http, ws, upload, sub }
}
