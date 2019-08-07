const api = require('../index.js')

describe('client', () => {
  it('should should export variables', () => {
    const { http, ws, upload, sub, config } = api()
    expect(http).toBeDefined()
    expect(ws).toBeDefined()
    expect(upload).toBeDefined()
    expect(sub).toBeDefined()
    expect(config).toBeDefined()
  })

  it('should set up default config', () => {
    const { config } = api()
    expect(config.host).toBe('localhost:4000')
    expect(config.ssl).toBe(false)
    expect(config.ws).toBe(true)
  })

  it('should allow custom config', () => {
    const { config } = api({ host: 'localhost:5000', ssl: true, ws: true })
    expect(config.host).toBe('localhost:5000')
    expect(config.ssl).toBe(true)
    expect(config.ws).toBe(true)
  })
})