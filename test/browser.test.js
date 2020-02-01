/**
* @jest-environment jsdom
*/

const waveorb = require('../browser.js')

describe('browser', () => {

  beforeEach(async () => {
    await new Promise(r => setTimeout(r, 500))
  })

  it('should post some data over http', async () => {
    const api = waveorb('http://localhost:5000')
    const result = await api.action('hello')
    expect(result.status).toBe('OK')
  })

  it('should post some data over http with params', async () => {
    const api = waveorb('http://localhost:5000')
    const result = await api.action('hello', { data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should work with websockets', async () => {
    const api = await waveorb('ws://localhost:5000')
    const result = await api.action('hello')
    expect(result.status).toBe('OK')
  })

  it('should work with websockets with params', async () => {
    const api = await waveorb('ws://localhost:5000')
    const result = await api.action('hello', { data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })
})