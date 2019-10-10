const FormData = require('./formdata.js')

module.exports = function (result, p, options, config) {
  const params = new FormData()
  for (const key in p) {
    params.append(key, p[key])
  }
  config.headers = {
    'content-type': 'multipart/form-data',
    'cache-control': 'no-cache'
  }
  const input = document.createElement('input')
  input.type = 'file'
  input.value = ''
  if (options.multiple) {
    input.multiple = true
  }
  if (options.accept) {
    input.accept = options.accept
  }
  function change() {
    const files = input.files
    for (const file of files) {
      params.append('file', file, file.name)
    }
    if (typeof options.progress === 'function') {
      config.onUploadProgress = function(event) {
        event.percent = Math.round((event.loaded * 100) / event.total)
        options.progress(event)
      }
    }
    result(params, config)
  }

  input.addEventListener('change', change)
  input.click()
}
