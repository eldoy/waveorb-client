(function() {
  var socket = async function(url, options) {
  // Connection ready states for web socket
  var CONNECTING = 0
  var OPEN = 1
  var CLOSING = 2
  var CLOSED = 3

  // Connection close codes
  var CLOSE_NORMAL = 1000
  var CLOSE_AWAY = 1001

  // Callback identifier
  var CBID = '$cbid'

  // Options
  if (!options) options = {}
  if (typeof options.reconnect === 'undefined' || options.reconnect === true) options.reconnect = 1000
  if (options.ping === true) options.ping = 1000
  if (typeof options.disconnect === 'undefined') options.disconnect = 3000

  // Variables
  var socket, callbacks, cid, interval, timeout

  function connect(resolve, reject) {
    callbacks = {}
    cid = 0
    socket = new WebSocket(url)

    socket.onmessage = function(event) {
      var data = JSON.parse(event.data)
      var id = data[CBID]
      if (id) {
        delete data[CBID]
        if (callbacks[id]) {
          callbacks[id](data, event)
          delete callbacks[id]
        }
      } else if (options.onmessage) {
        options.onmessage(data, event)
      }
    }

    socket.onopen = function(event) {
      if (resolve) resolve(api)
      ping()
      if (options.onopen) {
        options.onopen(api, event)
      }
    }

    socket.onerror = function(event) {
      if (reject) reject(event)
      if (options.onerror) {
        options.onerror(event)
      }
    }

    socket.onclose = function(event) {
      if (options.reconnect) {
        setTimeout(connect, options.reconnect)
      }
      if (options.onclose) {
        options.onclose(event)
      }
    }
  }

  function disconnect(code) {
    code = code || CLOSE_NORMAL
    socket.close(code)
  }

  function ping() {
    if (options.ping) {
      clearInterval(interval)
      clearTimeout(timeout)

      interval = setInterval(function() { send({ $ping: 1 }) }, options.ping)

      timeout = setTimeout(function() {
        clearInterval(interval)
        disconnect(CLOSE_AWAY)
      }, options.disconnect)
    }
  }

  function send(obj) {
    if (socket.readyState === OPEN) {
      socket.send(JSON.stringify(obj))
    }
  }

  function fetch(params) {
    return new Promise(function(resolve) {
      params[CBID] = ++cid
      callbacks[cid] = function(data) { resolve(data) }
      send(params)
    })
  }

  var api = { connect, send, fetch, disconnect }

  return new Promise(connect)
};
  var http = function(url, params, options) {
  return new Promise(function(resolve, reject) {
    if (!options) options = {}
    if (!params) params = {}
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function(event) {
      var json = JSON.parse(xhr.responseText)
      resolve(json)
    })
    xhr.addEventListener('error', function(event){
      reject(xhr)
    })
    xhr.open(options.method || 'POST', url + (options.path || '/'))

    // Set up upload if we have files
    var data
    if (options.files) {
      data = new FormData()

      // Add params to data
      for (var key in params) {
        data.append(key, params[key])
      }

      // Loop through each of the selected files
      for (var file of options.files) {
        data.append('file', file, file.name)
      }

      if (options.progress) {
        xhr.upload.addEventListener('progress', function(event) {
          event.percent = (event.loaded / event.total * 100).toFixed(2)
          options.progress(event)
        })
      }
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    }

    // Send data to server
    xhr.send(data || JSON.stringify(params))
  })
};
  window.waveorb = function(url, config) {
  if (url.indexOf('ws') === 0) {
    return socket(url, config || {})
  } else {
    function fetch(params, options) {
      return http(url, params, options)
    }
    function upload(params, options) {
      if (!options) options = {}
      return new Promise(function(resolve) {
        var input = document.createElement('input')
        input.type = 'file'
        input.value = null
        if (options.multiple) {
          input.multiple = true
        }
        if (options.accept) {
          input.accept = options.accept
        }
        input.onchange = async function() {
          resolve(await fetch(params, { files: input.files }))
        }
        input.click()
      })
    }
    return { fetch, upload }
  }
}
}())