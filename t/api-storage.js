'use strict'
const test = require('tape')
const path = require('path')
const levelup = require('levelup')
const leveldown = require('leveldown')
const encode = require('encoding-down')
const {pipe, through} = require('mississippi')
const db = levelup(encode(leveldown(path.join(__dirname, 'dbs')), {valueEncoding: 'json'}))
const storage = {tracks: db}
const api = require('../api/storage')(storage)
const favorites = require('./favorites')
const safe = require('json-stringify-safe')

test('readable  = api.putTrack(id, track)', t => {
  var track = favorites[0]
  var spy = []
  pipe(
    api.putTrack(track.id, track),
    through.obj((track, _, done) => {
      spy.push(track)
      done()
    }),
    err => {
      t.error(err, 'no exists error')
      t.deepEqual(spy, [{key: track.id, value: track}], safe(spy))
      t.end()
    }
  )
})

test('readable = api.removeTrack(id)', t => {
  t.test('case no registered -> notFoundError', tt => {
    var track = favorites[1]
    var spy = []
    pipe(
      api.removeTrack(track.id),
      through.obj((track, _, done) => {
        spy.push(track)
        done()
      }),
      err => {
        tt.ok(err.notFound, String(err))
        tt.deepEqual(spy, [], 'no result')
        tt.end()
      }
    )
  })
  t.test('case registered', tt => {
    var track = favorites[0]
    var spy = []
    pipe(
      api.removeTrack(track.id),
      through.obj((track, _, done) => {
        spy.push(track)
        done()
      }),
      err => {
        tt.error(err, 'no exists error')
        tt.deepEqual(spy, [{key: track.id, value: track}], safe(spy))
        tt.end()
      }
    )
  })
  t.test('db test', tt => {
    db.get(favorites[0].id, (err, track) => {
      tt.ok(err.notFound, `err.notFound - "${err.notFound}"`)
      tt.end()
    })
  })
  t.end()
})

test('readable = api.getTracks(opt)', t => {
  db.batch(favorites.map(track => (
    {type: 'put', key: track.id, value: track}
  )), err => {
    if (err) return console.error(err)
    var spy = []
    pipe(
      api.getTracks(),
      through.obj((tracks, _, done) => {
        spy.push(tracks)
        done()
      }),
      err => {
        t.error(err, 'no exists error')
        t.is(spy.length, 1, `spy length - "${spy.length}"`)
        t.deepEqual(spy[0], favorites.map(track => (
          {key: track.id, value: track}
        )), safe(spy[0]))
        t.end()
      }
    )
  })
})

test('readable = api.hasTrack(tracks)', t => {
  var keys = favorites.map(t => ({id: t.id})).concat({id: 'hoge'})
  var spy = []
  pipe(
    api.hasTrack(keys),
    through.obj((flg, _, done) => {
      spy.push(flg)
      done()
    }),
    err => {
      t.error(err, 'no exists error')
      t.deepEqual(spy, [{
        '607853': true,
        '644669': true,
        '1357553': true,
        '1522076': true,
        hoge: false
      }], safe(spy))
      t.end()
    }
  )
})
