# Waveorb client
NOTE: You need a waveorb server to use this client.

### Install
```
npm i waveorb-client
```

### Usage
```javascript
// Directly in webpack app
import client from 'waveorb-client'
const db = client('http://localhost:4000')

// As Nuxt plugin, in ~/plugins/db.js
import client from 'waveorb-client'

export default ({}, inject) => {
  inject('db', client('http://localhost:4000'))
}

// In nuxt.config.js
plugins: [
  '~/plugins/db.js'
]
```
