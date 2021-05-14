module.exports = {
  main: async function($) {
    return $.params.data || { status: 'OK' }
  }
}
