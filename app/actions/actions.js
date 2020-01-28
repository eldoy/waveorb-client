const actions = {}

actions.hello = {
  main: async function($) {
    return $.params.data
  }
}

actions.upload = {
  main: async function($) {
    const names = $.files.map(f => f.name)
    return { names }
  }
}

module.exports = actions
