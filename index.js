const http = require('taarn')
const socket = require('wsrecon')

module.exports = function(url, config = {}) {
  if (!url.indexOf('ws')) {
    return new Promise(function(resolve) {
      socket(url, config).then(function(s) {
        return resolve(s.fetch)
      })
    })
  }
  return function (data = {}, options = {}) {
    return http(url, data, options)
  }
}
