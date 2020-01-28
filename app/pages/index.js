module.exports = async function($) {

  return /* html */`
    <!doctype html>
    <html>
      <head>
        <title>Waveorb Client</title>
        <script src="/waveorb.js"></script>
      </head>
      <body>
        <button onclick="doUpload()">Upload</button>
        <script>
          var api = waveorb('http://localhost:5000')
          // Test upload
          async function doUpload() {
            var result = await api.upload({ action: 'upload' })
            console.log(result)
            result = await api.fetch({ action: 'hello' })
            console.log(result)
          }
        </script>
      </body>
    </html>
  `
}
