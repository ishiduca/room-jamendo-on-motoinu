const bl = require('bl')
const xtend = require('xtend')
const senderror = require('./senderror')

module.exports = function post (f) {
  return (req, res, params) => {
    req.pipe(bl((err, raw) => {
      if (err) return senderror(err, res)
      const str = String(raw)
      let json
      try {
        json = JSON.parse(str)
      } catch (e) {
        const err = new Error('can not JSON.parse')
        err.name = 'JSONParseError'
        err.data = str
        return senderror(err, 400, res)
      }
      f(req, res, xtend(params, json))
    }))
  }
}
