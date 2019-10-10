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
const api = client({ host: 'http://localhost:4000' })

// As Nuxt plugin, in ~/plugins/db.js
import client from 'waveorb-client'
export default ({}, inject) => {
  inject('api', client({ host: 'http://localhost:4000' }))
}

// In nuxt.config.js
plugins: [
  '~/plugins/db.js'
]

// Set up websocket connection
const socket = client('ws://localhost:4000', { reconnect: true, ping: 3000 })

// Websocket with SSL
const socket = client('wss://localhost:4000')

// Send through websocket
socket.fetch({
  path: 'createProject',
  data: {
    values: {
      name: 'nisse'
    }
  }
})

// Set up HTTP connection
const api = client('ws://localhost:4000', {})

// HTTP with SSL
const api = client('wss://localhost:4000')

// Send through http
api.fetch({
  path: 'createProject',
  data: {
    values: {
      name: 'nisse'
    }
  }
})

// Upload through api
api.upload({ path: 'createProject' })
```

### How it works
The path and data matches the route name and data.

If your server route looks like this:
```javascript
{
  createProject: {
    data: {
      values: {
        name: {
          is: '$string'
        }
      }
    }
  }
}
```
The client will match the route like this:
```javascript
{
  path: 'createProject',
  data: {
    values: {
      name: 'Hello'
    }
  }
}
```
