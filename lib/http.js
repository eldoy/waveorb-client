const axios = require('axios')
const upload = require('./upload.js')

module.exports = function (host, options) {
  async function fetch (params, config = {}) {
    return (await axios.post(host, params, config)).data
  }
  return {
    fetch,
    upload: async function (params, options = {}, config = {}) {
      return new Promise(function (resolve) {
        async function result (p, c) { resolve(await fetch(p, c)) }
        upload(result, params, options, config)
      })
    }
  }
}
