const _ = require('lodash')
const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config) {
  if (url.indexOf('ws') == 0) {
    return new Promise(function(resolve) {
      socket(url, config || {}).then(function(s) {
        resolve({
          action: function action(name, params = {}) {
            params.action = name
            return s.fetch(params)
          }
        })
      })
    })
  } else {
    function run(name, params = {}, options = {}) {
      params.action = name
      return http(url, params, options)
    }
    return { action: run, upload: run }
  }
}
