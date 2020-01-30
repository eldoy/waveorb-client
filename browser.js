const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config) {
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
        input.onchange = function() {
          fetch(params, { files: input.files }).then(function(result) {
            resolve(result)
          })
        }
        input.click()
      })
    }
    return { fetch, upload }
  }
}
