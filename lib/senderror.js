const safe = require('json-stringify-safe')
module.exports = function sendError (err, statusCode, res) {
  if (res == null) {
    res = statusCode
    statusCode = 500
  }
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(safe({errors: [].concat(err).map(wrapError)}))
}

function wrapError (err) {
  err.toJSON || (err.toJSON = function () {
    return {
      name: this.name,
      messsage: this.messsage,
      code: this.code,
      data: this.data
    }
  })
  return err
}
