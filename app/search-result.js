var xtend = require('xtend')
var {through} = require('mississippi')
var {html} = require('motoinu')
var css = require('sheetify')
var w = require('global/window')
var l = w.location
var home = `${l.protocol}//${l.host}`
var {post} = require('jsonist')
var bFavs = require('./favorites-button')
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')
var prefix = css`
  :host {}
  :host .isSelected {
    background-color: #eeeeee;
  }
`
module.exports = {
  init () {
    return {
      model: {
        title: '',
        list: []
      }
    }
  },
  update: update({
    [ACTIONS.setSearchResultTitle] (model, payload) {
      return {model: xtend(model, {title: payload})}
    },
    [ACTIONS.setSearchResultList] (model, payload) {
      return {
        model: xtend(model, {list: payload}),
        effect: {type: EFFECTS.GET_REGISTERED_TRACK_FROM_PLAYLIST}
      }
    },
    [ACTIONS.onGetRegisteredTrackFromPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          xtend(wTrack, {selected: !!payload[wTrack._.id]})
        ))})
      }
    },
    [ACTIONS.onRemoveTrackFromPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload
            ? xtend(wTrack, {selected: false})
            : wTrack
        ))})
      }
    },
    [ACTIONS.onRegisterTrackToPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload
            ? xtend(wTrack, {selected: true})
            : wTrack
        ))})
      }
    },
    [ACTIONS.prepareRequestFavoritesHasTrack] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.REQUEST_FAVORITES_HASTRACK,
          payload: {tracks: payload.map(track => ({id: track.id}))}
        }
      }
    },
    [ACTIONS.onRequestFavoritesHasTrack] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          xtend(wTrack, {favs: payload[wTrack._.id]})
        ))})
      }
    },
    [ACTIONS.putFavoritesToSearchResult] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload ? xtend(wTrack, {favs: true}) : wTrack
        ))})
      }
    },
    [ACTIONS.removeFavoritesToSearchResult] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload ? xtend(wTrack, {favs: false}) : wTrack
        ))})
      }
    }
  }),
  run: run({
    [EFFECTS.GET_REGISTERED_TRACK_FROM_PLAYLIST] () {
      var s = through.obj()
      s.end({type: ACTIONS.getRegisteredTrackFromPlaylist})
      return s
    },
    [EFFECTS.REQUEST_FAVORITES_HASTRACK] (payload) {
      var s = through.obj()
      post(`${home}/favorites/hasTrack`, payload, (err, data, res) => {
        if (err || data.errors) {
          s.end({
            type: ACTIONS.errors,
            payload: err || data.errors
          })
          return console.error(err || data.errors)
        }

        s.end({
          type: ACTIONS.onRequestFavoritesHasTrack,
          payload: data
        })
      })
      return s
    }
  }),
  view (model, actionsUp) {
    return html`
      <section class=${prefix}>
        <header>
          <h3>${model.title}</h3>
        </header>
        <article class="columns is-multiline">
          ${model.list.map(wTrack => html`
            <div class="column">
              <div class=${wTrack.selected ? 'box isSelected' : 'box'}>
                <figure class="image is-128x128">
                  <a onclick=${e => {
                    e.stopPropagation()
                    actionsUp({
                      type: ACTIONS.registerTrackToPlaylist,
                      payload: {_: wTrack._, favs: wTrack.favs, focus: null}
                    })
                  }}>
                    <img src=${wTrack._.image} />
                  </a>
                </figure>
                <div class="content">
                  <p>
                    <strong>
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href=${wTrack._.shareurl}
                      >
                        ${wTrack._.name}
                      </a>
                    </strong>
                    <span>(via ${wTrack._.album_name || 'single'})</span>
                    <br />
                    <span>${wTrack._.artist_name}</span>
                  </p>
                </div>
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      ${bFavs(wTrack.favs, wTrack._, actionsUp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `)}
        </article>
      </section>
    `
  }
}
