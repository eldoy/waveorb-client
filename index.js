const _ = require('lodash')
const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config = {}) {
  if (url.indexOf('ws') === 0) {
    return socket(url, config)
  } else {
    function fetch(params, options) {
      return http(url, params, options)
    }
    function upload(params, options) {
      return http(url, params, options)
    }
    return { fetch, upload }
  }
}
