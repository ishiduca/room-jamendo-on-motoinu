var {stringify} = require('querystring')
var {get} = require('jsonist')
var {through} = require('mississippi')

module.exports = function (config) {
  return {
    searchTracks (query) {
      const s = through.obj()
      const uri = `${config.uriHome}/tracks/?${stringify(query)}`
      get(uri, (err, data, response) => {
        if (err) return s.emit('error', err, response)
        if (data.headers.code !== 0) {
          err = new Error(data.headers.error_message)
          err.name = `${data.headers.status}Error`
          err.code = data.headers.code
          err.data = query
          return s.emit('error', err)
        }
        s.end(data)
      })
      return s
    }
  }
}
