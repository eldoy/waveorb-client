const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify-es')
const json = require('rollup-plugin-json')

const babelOptions = {
  babelrc: false,
  runtimeHelpers: true,
  exclude: 'node_modules/**',
  presets: [
    [
      '@babel/env', {
        modules: false,
        targets: '> 0.25%, not dead'
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime']
}

module.exports = {
  input: 'index.js',
  plugins: [
    resolve({ mainFields: ['index'], preferBuiltins: true, browser: true }),
    json(),
    commonjs(),
    babel(babelOptions),
    uglify()
  ],
  output: {
    name: 'waveorb',
    file: 'dist/bundle.js',
    format: 'iife'
  }
}
