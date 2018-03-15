const valid = require('is-my-json-valid')
const senderror = require('./senderror')

module.exports = function (schema, f) {
  return (req, res, params) => {
    const v = valid(schema)
    if (!v(params, {verbose: true})) senderror(v.errors, 400, res)
    else f(req, res, params)
  }
}
