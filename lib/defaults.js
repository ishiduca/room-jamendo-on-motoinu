const xtend = require('xtend')
module.exports = function (defaultParams, f) {
  return (req, res, params) => f(req, res, xtend(defaultParams, params))
}
