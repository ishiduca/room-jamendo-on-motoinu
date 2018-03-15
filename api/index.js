const safe = require('json-stringify-safe')
const xtend = require('xtend')
const {through} = require('mississippi')
const senderror = require('../lib/senderror')

const defaultHeaders = {
  'content-type': 'application/json; charset=utf-8'
}

module.exports = function (config, opt) {
  const {putTrack, removeTrack, getTracks, hasTrack} = require('./storage')(opt.storage)
  const {searchTracks} = require('./request')(config.request)

  return {
    searchTracks (req, res, params) {
      setHeader(res)
      searchTracks(params).once('error', err => senderror(err, res))
        .pipe(logAndStringify())
        .pipe(res)
    },
    putTrack (req, res, params) {
      setHeader(res)
      putTrack(params.id, params).once('error', err => senderror(err, res))
        .pipe(logAndStringify())
        .pipe(res)
    },
    removeTrack (req, res, params) {
      setHeader(res)
      removeTrack(params.id).once('error', err => senderror(err, res))
        .pipe(logAndStringify())
        .pipe(res)
    },
    getTracks (req, res, params) {
      setHeader(res)
      getTracks(params).once('error', err => senderror(err, res))
        .pipe(logAndStringify())
        .pipe(res)
    },
    hasTrack (req, res, params) {
      setHeader(res)
      hasTrack(params.tracks).once('error', err => senderror(err, res))
        .pipe(logAndStringify())
        .pipe(res)
    }
  }
}

function setHeader (res, opt) {
  opt = xtend(defaultHeaders, opt)
  Object.keys(opt).forEach(k => res.setHeader(k, opt[k]))
}

function logAndStringify () {
  return through.obj((v, _, done) => {
    console.log(v)
    done(null, safe(v))
  })
}
