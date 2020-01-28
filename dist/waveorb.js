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
  var http = function(url, options) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest()
    if (!options) options = {}
    if (options.async !== false) options.async = true
    if (!options.headers) options.headers = {}
    if (!options.params) options.params = {}

    // Set up upload if we have files
    var formData
    if (options.files) {
      if (!options.name) options.name = 'file'
      formData = new FormData()

      // Loop through each of the selected files
      for (var file of options.files) {
        formData.append(options.name, file, file.name)
      }

      if (options.progress) {
        xhr.upload.addEventListener('progress', function(event) {
          event.percent = (event.loaded / event.total * 100).toFixed(2)
          options.progress(event)
        })
      }

      // Add content type if it doesn't exist
      if (!options.headers['content-type']) {
        options.headers['content-type'] = 'multipart/form-data'
      }

    } else if (!Object.keys(options.headers).map(function(x) { return x.toLowerCase() }).includes('content-type')) {
      options.headers['content-type'] = 'application/json; charset=utf-8'
    }

    xhr.addEventListener('load', function(event) {
      var json = JSON.parse(xhr.responseText)
      resolve(json)
    })

    xhr.addEventListener('error', function(event){
      reject(xhr)
    })

    xhr.open(options.method || 'post', url + (options.path || '/'), options.async)

    // Set headers
    for (var header in options.headers) {
      xhr.setRequestHeader(header, options.headers[header])
    }

    var data = formData || JSON.stringify(options.params)

    // Send data to server
    xhr.send(data)
  })
};
  window.waveorb = function(url, options = {}) {
  if (url.indexOf('ws') === 0) {
    return socket(url, options)
  } else {
    return {
      fetch: function(params) {
        return http(url, { params })
      },
      upload: function(params, options = {}, config = {}) {
        return new Promise(function(resolve) {
          upload(params, options, config, async function(params) {
            resolve(await fetch(params, config))
          })
        })
      }
    }
  }
}
}())