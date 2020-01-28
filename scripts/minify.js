#!/usr/bin/env node
const fs = require('fs')
const uglify = require('uglify-es')

const name = 'waveorb'

if (!fs.existsSync(`./dist/${name}.js`)) {
  console.log("Run 'npm run build' and try again")
} else {
  const code = fs.readFileSync(`./dist/${name}.js`, 'utf-8')
  const result = uglify.minify(code)
  fs.writeFileSync(`./dist/${name}-min.js`, result.code)
}
