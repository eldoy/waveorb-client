const Socket = require('wsrecon')

module.exports = function (host, options) {
  return new Socket(host, options)
}
