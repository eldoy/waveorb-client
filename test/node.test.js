/**
* @jest-environment node
*/

const waveorb = require('../index.js')

describe('node', () => {

  beforeEach(async () => {
    await new Promise(r => setTimeout(r, 500))
  })

  it('should post some data over http', async () => {
    const api = waveorb('http://localhost:5000')
    const result = await api.fetch({ action: 'hello', data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should work with websockets', async () => {
    const api = await waveorb('ws://localhost:5000')
    const result = await api.fetch({ action: 'hello', data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should upload a file', async () => {
    const api = waveorb('http://localhost:5000')
    const files = ['test/assets/hello.txt']
    const result = await api.upload({ action: 'upload' }, { files })
    expect(result.names[0]).toBe('hello.txt')
  })
})
