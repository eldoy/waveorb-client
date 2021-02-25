/**
* @jest-environment node
*/

const waveorb = require('../index.js')
let api = waveorb('http://localhost:5000')

describe('node', () => {

  beforeEach(async () => {
    await new Promise(r => setTimeout(r, 200))
  })

  it('should post some data over http', async () => {
    const result = await api({ action: 'project/hello' })
    expect(result.status).toBe('OK')
  })

  it('should post some data over http with params', async () => {
    const result = await api({ action: 'project/hello', data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should work with websockets', async () => {
    const result = await api({ action: 'project/hello' })
    expect(result.status).toBe('OK')
  })

  it('should work with websockets with params', async () => {
    const result = await api({ action: 'project/hello', data: { hello: 'waveorb' } })
    expect(result.hello).toBe('waveorb')
  })

  it('should upload a file', async () => {
    const files = ['test/assets/hello.txt']
    const result = await api({ action: 'project/upload' }, { files })
    expect(result.names[0]).toBe('hello.txt')
  })
})
