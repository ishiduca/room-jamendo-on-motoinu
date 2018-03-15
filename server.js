'use strict'
const path = require('path')
const http = require('http')
const xtend = require('xtend')
const ecstatic = require('ecstatic')(path.join(__dirname, 'static'))
const levelup = require('levelup')
const leveldown = require('leveldown')
const encode = require('encoding-down')
const {def, route} = require('./lib/router')()
const post = require('./lib/post')
const defaults = require('./lib/defaults')
const valid = require('./lib/valid')
const defaultParams = {
  searchTracks: xtend(
    require('./defaults/search-tracks'),
    require('./client_id')
  )
}
const schemas = {
  searchTracks: require('./schemas/search-tracks'),
  putTrack: require('./schemas/put-track'),
  removeTrack: require('./schemas/remove-track'),
  hasTrack: require('./schemas/has-track')
}
const config = {
  request: {
    uriHome: 'https://api.jamendo.com/v3.0'
  }
}
const dbPath = path.join(__dirname, 'dbs')
const storage = {
  tracks: levelup(encode(leveldown(dbPath), {valueEncoding: 'json'}))
}
const opt = {
  storage: storage
}

const api = require('./api')(config, opt)
def('/search/tracks', post(defaults(defaultParams.searchTracks, valid(schemas.searchTracks, api.searchTracks))))
def('/favorites/putTrack', post(valid(schemas.putTrack, api.putTrack)))
def('/favorites/removeTrack', post(valid(schemas.removeTrack, api.removeTrack)))
def('/favorites/hasTrack', post(valid(schemas.hasTrack, api.hasTrack)))
def('/favorites/getTracks', api.getTracks)

module.exports = http.createServer(route(ecstatic))
