const Socket = require('wsrecon')
const axios = require('axios')
const isBrowser = typeof window !== 'undefined'
console.log({ isBrowser })
const SOCKET_OPTIONS = { reconnect: 1000, ping: 3000 }
const DEFAULT_CONFIG = { host: 'localhost:4000', ssl: false, ws: true }

module.exports = function(customConfig = {}) {
  const events = {}
  const subs = {}
  const config = Object.assign({}, DEFAULT_CONFIG, customConfig)

  // Find the URL for ws or http
  function url(type) {
    return `${type}${config.ssl ? 's' : ''}://${config.host}`
  }

  // Add session token to params if it exists
  function tokenize(params) {
    const { token } = config
    if (token) {
      if (params.constructor === FormData) {
        params.append({ token })
      } else {
        params.token = token
      }
    }
    return params
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

  function ws(path) {
    return async function (...data) {
      const params = tokenize({ db: { path, data } })
      const run = await socket.fetch(params)
      console.log(JSON.stringify(run.result))
      return run.result
    }
  }

  ws.on = function(event, fn) {
    console.log('REGISTERING EVENT:', event)
    events[event] = fn
  }

  async function send(params, config = {}) {
    const post = (await axios.post(url('http'), params, config)).data
    console.log(JSON.stringify(post.result))
    return post.result
  }

  function http(path) {
    return async function (...data) {
      const params = tokenize({ db: { path, data } })
      return await send(params)
    }
  }

  function formdata(path, options, files) {
    const params = tokenize(new FormData())
    params.append('path', path)
    params.append('options', options)
    for (const file of files) {
      params.append('file', file, file.name)
    }
    return params
  }

  function upload(path) {
    return function(options = {}) {
      return new Promise(function(resolve) {
        const config = {
          headers: Object.assign(
            { 'content-type': 'multipart/form-data', 'cache-control': 'no-cache' },
            options.headers || {}
          )
        }
        const input = document.createElement('input')
        input.type = 'file'
        input.value = ''

        if (options.multiple) {
          input.multiple = true
        }
        if (options.accept) {
          input.accept = options.accept
        }
        async function change() {
          console.log('CHANGE')
          const files = input.files
          const params = formdata(path, options, files)

          if (options.progress) {
            config.onUploadProgress = function(event) {
              event.percent = Math.round((event.loaded * 100) / event.total)
              options.progress(event)
            }
          }
          resolve(await send(params, config))
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

  return { http, ws, upload, sub, config }
}
