const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(host, config = {}) {
  if (!host.indexOf('ws')) {
    return socket(host, config)
  }
  return function(path, data = {}, options = {}) {
    return http(host + path, data, options)
  }
}
