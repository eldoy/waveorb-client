const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config = {}) {
  if (!url.indexOf('ws')) {
    return socket(url, config)
  }
  return function (data = {}, options = {}) {
    return http(url, data, options)
  }
}
