module.exports = async function($) {
  const names = $.files.map(f => f.name)
  return { names }
}
