const http = require('taarn')

module.exports = function(host) {
  return function(path, data, options) {
    return http(host + path, data || {}, options || {})
  }
}
