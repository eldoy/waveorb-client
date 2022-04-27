/**
* @jest-environment node
*/

const waveorb = require('../index.js')
let http = waveorb('http://localhost:5000')

describe('node', () => {

  beforeEach(async () => {
    await new Promise(r => setTimeout(r, 1000))
  })

  it('should post some data over http', async () => {
    const result = await http('/project/hello')
    expect(result.status).toBe('OK')
  })

  it('should post some data over http with params', async () => {
    const result = await http('/project/hello', { hello: 'waveorb' })
    expect(result.hello).toBe('waveorb')
  })

  it('should upload a file', async () => {
    const files = ['test/assets/hello.txt']
    const result = await http('/project/upload', {}, { files })
    expect(result.names[0]).toBe('hello.txt')
  })
})
