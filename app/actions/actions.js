const actions = {}

actions.hello = {
  main: async function($) {
    console.log('HELLO')
    return $.params.data || { status: 'OK' }
  }
}

actions.upload = {
  main: async function($) {
    console.log('UPLOAD')
    const names = $.files.map(f => f.name)
    return { names }
  }
}

module.exports = actions
