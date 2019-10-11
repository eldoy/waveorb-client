const FormData = require('./formdata.js')

module.exports = function (_params, options, config, result) {
  const params = new FormData()
  for (const key in _params) {
    params.append(key, _params[key])
  }
  config.headers = {
    ...config.headers,
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
    result(params)
  }

  input.addEventListener('change', change)
  input.click()
}
