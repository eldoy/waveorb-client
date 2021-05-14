/**
* @jest-environment jsdom
*/

const waveorb = require('../index.js')
let http = waveorb('http://localhost:5000')

describe('browser', () => {

  beforeEach(async () => {
    await new Promise(r => setTimeout(r, 500))
  })

  it('should post some data over http', async () => {
    const result = await http({ action: 'project/hello' })
    expect(result.status).toBe('OK')
  })

  it('should post some data over http with params', async () => {
    const result = await http({ action: 'project/hello', data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should work with websockets', async (done) => {
    const socket = await waveorb('ws://localhost:5000')
    socket.on('message', function(data) {
      expect(data.status).toBe('OK')
      done()
    })
    socket.send({ action: 'project/hello' })
  })

  it('should work with websockets with params', async (done) => {
    const socket = await waveorb('ws://localhost:5000')
    socket.on('message', function(data) {
      expect(data.hello).toBe('waveorb')
      done()
    })
    socket.send({ action: 'project/hello', data: { hello: 'waveorb' } })
  })
})