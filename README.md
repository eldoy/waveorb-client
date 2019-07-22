import db from '../lib/db.js'

export default ({}, inject) => {
  inject('db', db('http://localhost:4000'))
}
