/**
 *
 * @param {any} arg
 * @returns {undefined|number}
 */
function parseInt(arg) {
  const parsed = Number(arg)
  if(isNaN(Number(arg))) {
    return undefined
  } else {
    return Math.floor(parsed)
  }
}

module.exports = {
  parseInt
}
