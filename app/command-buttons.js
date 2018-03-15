var {html} = require('motoinu')
var {get, post} = require('jsonist')
var {through} = require('mississippi')
var smoothScroll = require('smoothscroll')
var d = require('global/document')
var w = require('global/window')
var l = w.location
var home = `${l.protocol}//${l.host}`
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')

module.exports = {
  init () {
    return {
      model: null,
      effect: {
        type: EFFECTS.REQUEST_FAVORITES_GETTRACKS
      }
    }
  },
  update: update({
    [ACTIONS.requestFavoritesGetTracks] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.REQUEST_FAVORITES_GETTRACKS
        }
      }
    },
    [ACTIONS.requestFavoritesPutTrack] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.REQUEST_FAVORITES_PUTTRACK,
          payload: payload
        }
      }
    },
    [ACTIONS.requestFavoritesRemoveTrack] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.REQUEST_FAVORITES_REMOVETRACK,
          payload: payload
        }
      }
    },
    [ACTIONS.smoothScroll] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.SMOOTH_SCROLL,
          payload: payload
        }
      }
    }
  }),
  run: run({
    [EFFECTS.REQUEST_FAVORITES_GETTRACKS] (payload) {
      var s = through.obj()
      get(`${home}/favorites/getTracks`, (err, data, res) => {
        if (err || data.errors) {
          s.end({
            type: ACTIONS.errors,
            payload: err || data.errors
          })
          return console.error(err || data.errors)
        }
        s.write({
          type: ACTIONS.setSearchResultTitle,
          payload: `favorites(${data.length})`
        })
        s.end({
          type: ACTIONS.setSearchResultList,
          payload: data.map(p => ({
            _: p.value, favs: true, selected: null
          }))
        })
      })
      return s
    },
    [EFFECTS.REQUEST_FAVORITES_PUTTRACK] (payload) {
      var s = through.obj()
      post(`${home}/favorites/putTrack`, payload, (err, data, res) => {
        if (err || data.errors) {
          s.end({
            type: ACTIONS.errors,
            payload: err || data.errors
          })
          return console.error(err || data.errors)
        }
        s.write({
          type: ACTIONS.putFavoritesToSearchResult,
          payload: data.key
        })
        s.write({
          type: ACTIONS.putFavoritesToPlaylist,
          payload: data.key
        })
        s.end({
          type: ACTIONS.putFavoritesToAudioPlayer,
          payload: data.key
        })
      })
      return s
    },
    [EFFECTS.REQUEST_FAVORITES_REMOVETRACK] (payload) {
      var s = through.obj()
      post(`${home}/favorites/removeTrack`, payload, (err, data, res) => {
        if (err || data.errors) {
          s.end({
            type: ACTIONS.errors,
            payload: err || data.errors
          })
          return console.error(err || data.errors)
        }
        s.write({
          type: ACTIONS.removeFavoritesToSearchResult,
          payload: data.key
        })
        s.write({
          type: ACTIONS.removeFavoritesToPlaylist,
          payload: data.key
        })
        s.end({
          type: ACTIONS.removeFavoritesToAudioPlayer,
          payload: data.key
        })
      })
      return s
    },
    [EFFECTS.SMOOTH_SCROLL] (payload) {
      smoothScroll(d.querySelector(payload))
    }
  }),
  view (model, actionsUp) {
    return html`
      <div class="buttons">
        ${b('get Favs', e => actionsUp({
          type: ACTIONS.requestFavoritesGetTracks
        }))}
        ${b('history', e => actionsUp({
          type: ACTIONS.showHistories
        }))}
        ${b('go search result', e => actionsUp({
          type: ACTIONS.smoothScroll,
          payload: '#wrap-search-result'
        }))}
      </div>
    `
  }
}

function b (content, onclick) {
  return html`
    <a class="button" onclick=${e => {
      e.stopPropagation()
      onclick(e)
    }}>
      ${content}
    </a>
  `
}
