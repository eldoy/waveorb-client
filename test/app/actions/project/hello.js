module.exports = async function($) {
  console.log($.params)
  if (Object.keys($.params).length > 0) {
    return $.params
  }
  return { status: 'OK' }
}
