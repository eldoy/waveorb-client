/**
* @jest-environment jsdom
*/

const waveorb = require('../index.js')
let http = waveorb('http://localhost:5000')

describe('browser', () => {

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
})
