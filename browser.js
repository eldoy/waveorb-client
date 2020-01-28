const http = require('taarn')
const socket = require('wsrecon')
const upload = require('uload')

module.exports = function(url, options = {}) {
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
