#!/usr/bin/env node
const fs = require('fs')
const uglify = require('uglify-es')
const fspath = require('path')
const client = require('../index.js')
const http = require(fspath.join(process.cwd(), 'node_modules', 'taarn', 'browser.js'))
const socket = require(fspath.join(process.cwd(), 'node_modules', 'wsrecon', 'index.js'))

const name = 'waveorb'

const code = `(function() {
  var socket = ${socket};
  var http = ${http};
  window.${name} = ${client}
}())`

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/waveorb.js', code)
const result = uglify.minify(code)
fs.writeFileSync(`./dist/${name}-min.js`, result.code)
