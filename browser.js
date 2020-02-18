const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config) {
  if (url.indexOf('ws') == 0) {
    return new Promise(function(resolve) {
      socket(url, config || {}).then(function(s) {
        resolve({
          action: function action(name, params) {
            if (!params) params = {}
            params.action = name
            return s.fetch(params)
          }
        })
      })
    })
  } else {
    function action(name, params, options) {
      if (!params) params = {}
      params.action = name
      return http(url, params, options)
    }

    function upload(name, params, options) {
      if (!params) params = {}
      if (!options) options = {}
      return new Promise(function(resolve) {
        var input = document.createElement('input')
        input.type = 'file'
        if (options.multiple) {
          input.multiple = true
        }
        if (options.accept) {
          input.accept = options.accept
        }
        input.onchange = function() {
          options.files = input.files
          action(name, params, options).then(function(result) {
            resolve(result)
          })
        }
        input.click()
      })
    }
    return { action, upload }
  }
}
