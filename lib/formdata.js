module.exports = typeof window === 'undefined' ? require('form-data') : window.FormData
