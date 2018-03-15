'use strict'
var test = require('tape')
var valid = require('is-my-json-valid')
var scheams = {
  searchResult: require('../schemas/search-result'),
  playlist: require('../schemas/playlist')
}
var data = require('./result')

test('schemas.searchResult({title: string, list: [wrapTrackOfSearchResult]})', t => {
  var v = valid(scheams.searchResult)
  t.test('default', tt => {
    v({
      title: 'foo default',
      list: data.results.map(t => ({_: t, favs: null, selected: null}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.test('update selected', tt => {
    v({
      title: 'foo update selected',
      list: data.results.map((t, i) => ({_: t, favs: null, selected: !i}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.test('update favs', tt => {
    v({
      title: 'foo',
      list: data.results.map((t, i) => ({_: t, favs: !i, selected: !!i}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.end()
})

test('schemas.playlist({title: string, list: [wrapTrackOfPlaylist]})', t => {
  var v = valid(scheams.playlist)
  t.test('default', tt => {
    v({
      repeat: true,
      list: data.results.map(t => ({_: t, favs: null, focus: null}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.test('update focus', tt => {
    v({
      repeat: true,
      list: data.results.map((t, i) => ({_: t, favs: null, focus: !i}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.test('update favs', tt => {
    v({
      repeat: false,
      list: data.results.map((t, i) => ({_: t, favs: !i, focus: !!i}))
    })
    tt.is(v.errors, null, 'v.errors == null')
    tt.end()
  })
  t.end()
})
