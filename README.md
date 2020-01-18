# Waveorb client
This is the client for the [Waveorb application development framework.](https://waveorb.com)

### Install
```
npm i waveorb-client
```

### Usage
In a vanilla HTML app, include the content of `dist/bundle.js` in the layout of your page. The client will be available in the `waveorb` variable.
```javascript
// Include in webpack app
import client from 'waveorb-client'
const api = client('http://localhost:5000')

// As Nuxt plugin, in ~/plugins/waveorb.js
import client from 'waveorb-client'
export default ({}, inject) => {
  inject('api', client('http://localhost:5000'))
}

// In nuxt.config.js
plugins: [
  '~/plugins/waveorb.js'
]

// Set up websocket connection
const socket = client('ws://localhost:5000', { reconnect: true, ping: 3000 })

// Websocket with SSL
const socket = client('wss://localhost:5000')

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
const api = client('ws://localhost:5000', {})

// HTTP with SSL
const api = client('wss://localhost:5000')

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
The path and data matches the route. If your server route looks like this:
```javascript
{
  createProject: {
    // The data params will be validated like this
    validate: {
      data: {
        name: {
          is: '$string'
        }
      }
    },
    main: async function($) {
      // The data is available in params:
      $.params.data
    }
  }
}
```
then the client will match the route like this:
```javascript
{
  path: 'createProject',
  data: {
    name: 'Hello'
  }
}
```
