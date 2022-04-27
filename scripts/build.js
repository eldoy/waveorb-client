#!/usr/bin/env node
const fs = require('fs')
const uglify = require('uglify-es')
const beautify = require('js-beautify').js
const fspath = require('path')
const client = require('../index.js')
const http = require(fspath.join(process.cwd(), 'node_modules', 'taarn', 'browser.js'))

const name = 'waveorb'

let code = `(function() {
  var http = ${http};
  window.${name} = ${client}
}())`

code = beautify(code, { indent_size: 2 })

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync(`./dist/${name}.js`, code)
const result = uglify.minify(code)
fs.writeFileSync(`./dist/${name}-min.js`, result.code)
