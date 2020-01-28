#!/usr/bin/env node
const fs = require('fs')
const fspath = require('path')
const client = require('../browser.js')
const http = require(fspath.join(process.cwd(), 'node_modules', 'taarn', 'browser.js'))
const socket = require(fspath.join(process.cwd(), 'node_modules', 'wsrecon', 'index.js'))
const upload = require(fspath.join(process.cwd(), 'node_modules', 'uload', 'index.js'))
const code = `(function() {
  var socket = ${socket};
  var http = ${http};
  window.waveorb = ${client}
}())`

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/waveorb.js', code)
