var xtend = require('xtend')
var {html} = require('motoinu')
var css = require('sheetify')
var {through} = require('mississippi')
var shuffle = require('array-shuffle')
var bFavs = require('./favorites-button')
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')
var prefix = css`
  :host {}
  :host ol {
    height: 200px;
    overflow: auto;
  }
  :host .isFocus {
    background-color: #ffeeaa;
  }
`
module.exports = {
  init () {
    return {
      model: {
        repeat: false,
        list: []
      }
    }
  },
  update: update({
    [ACTIONS.onFocusNowOnPlaying] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload
            ? xtend(wTrack, {focus: true}) : xtend(wTrack, {focus: false})
        ))})
      }
    },
    [ACTIONS.findNextTrack] (model, payload) {
      if (model.list.length === 0) {
        console.warn('! there is not one song in the playlist.')
        return {model}
      }

      let n = model.repeat ? 0 : (payload || 1)
      let c
      model.list.some((wTrack, i) => {
        if (wTrack.focus) {
          c = i + n
          return true
        }
      })
      if (c > model.list.length - 1) c = 0
      else if (c < 0) c = model.list.length - 1
      if (c == null) c = 0
      return {
        model: model,
        effect: {
          type: EFFECTS.PREPARE_FOCUS_NOW_ON_PLAYING,
          payload: model.list[c]
        }
      }
    },
    [ACTIONS.shufflePlaylistList] (model) {
      return {model: xtend(model, {list: shuffle(model.list)})}
    },
    [ACTIONS.togglePlaylistRepeat] (model) {
      return {model: xtend(model, {repeat: !model.repeat})}
    },
    [ACTIONS.getRegisteredTrackFromPlaylist] (model) {
      return {
        model: model,
        effect: {
          type: EFFECTS.ON_GET_REGISTERED_TRACK_FROM_PLAYLIST,
          payload: model.list.reduce((x, wTrack) => (
            (x[wTrack._.id] = true) && x
          ), {})
        }
      }
    },
    [ACTIONS.registerTrackToPlaylist] (model, payload) {
      if (model.list.map(wTrack => wTrack._.id).some(id => payload._.id === id)) {
        console.warn('! the same track already registered in the playlist')
        return {model}
      }

      return {
        model: xtend(model, {list: model.list.concat(payload)}),
        effect: {
          type: EFFECTS.ON_REGISTER_TRACK_TO_PLAYLIST,
          payload: payload._.id
        }
      }
    },
    [ACTIONS.removeTrackFromPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.filter(wTrack => (
          wTrack._.id !== payload
        ))}),
        effect: {
          type: EFFECTS.ON_REMOVE_TRACK_FROM_PLAYLIST,
          payload: payload
        }
      }
    },
    [ACTIONS.putFavoritesToPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload ? xtend(wTrack, {favs: true}) : wTrack
        ))})
      }
    },
    [ACTIONS.removeFavoritesToPlaylist] (model, payload) {
      return {
        model: xtend(model, {list: model.list.map(wTrack => (
          wTrack._.id === payload ? xtend(wTrack, {favs: false}) : wTrack
        ))})
      }
    }
  }),
  run: run({
    [EFFECTS.ON_GET_REGISTERED_TRACK_FROM_PLAYLIST] (payload) {
      var s = through.obj()
      s.end({
        type: ACTIONS.onGetRegisteredTrackFromPlaylist,
        payload: payload
      })
      return s
    },
    [EFFECTS.ON_REGISTER_TRACK_TO_PLAYLIST] (payload) {
      var s = through.obj()
      s.end({
        type: ACTIONS.onRegisterTrackToPlaylist,
        payload: payload
      })
      return s
    },
    [EFFECTS.ON_REMOVE_TRACK_FROM_PLAYLIST] (payload) {
      var s = through.obj()
      s.end({
        type: ACTIONS.onRemoveTrackFromPlaylist,
        payload: payload
      })
      return s
    },
    [EFFECTS.PREPARE_FOCUS_NOW_ON_PLAYING] (payload) {
      var s = through.obj()
      s.end({
        type: ACTIONS.focusNowOnPlaying,
        payload: payload
      })
      return s
    }
  }),
  view (model, actionsUp) {
    return html`
      <section class=${prefix}>
        <header class="level">
          <div class="level-left">
            <div class="level-item">
              <h3>playlist</h3>
            </div>
          </div>
          <div class="level-right">
            <div class="field is-grouped">
              ${b('shuffle', e => actionsUp({
                type: ACTIONS.shufflePlaylistList
              }))}
              ${b('prev', e => actionsUp({
                type: ACTIONS.findNextTrack, payload: -1
              }))}
              ${b('next', e => actionsUp({
                type: ACTIONS.findNextTrack, payload: +1
              }))}
              ${checkbox(model.repeat, e => actionsUp({
                type: ACTIONS.togglePlaylistRepeat
              }))}
            </div>
          </div>
        </header>
        <article>
          <ol>
            ${model.list.map(wTrack => html`
              <li class=${wTrack.focus ? 'list isFocus' : 'list'}>
                <div class="media">
                  <figure class="meida-left">
                    <p class="image is-64x64">
                      <a onclick=${e => {
                        e.stopPropagation()
                        actionsUp({
                          type: ACTIONS.focusNowOnPlaying,
                          payload: wTrack
                        })
                      }}>
                        <img src=${wTrack._.image} />
                      </a>
                    </p>
                  </figure>
                  <article class="media-content">
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
                        <span> | </span>
                        <span>(via ${wTrack._.album_name || 'single'})</span>
                        <br />
                        <span>${wTrack._.artist_name}</span>
                      </p>
                    </div>
                    <div class="level is-mobile">
                      <div class="level-left">
                        <div class="level-item">
                          ${bFavs(wTrack.favs, wTrack._, actionsUp)}
                        </div>
                        <div class="level-item">
                          ${b('remove', e => actionsUp({
                            type: ACTIONS.removeTrackFromPlaylist,
                            payload: wTrack._.id
                          }))}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </li>
            `)}
          </ol>
        </article>
      </section>
    `
  }
}

function checkbox (repeat, onclick) {
  var c = html`<input type="checkbox" onclick=${e => {
    e.stopPropagation()
    onclick(e)
  }}/>`
  if (repeat) c.setAttribute('checked', 'checked')
  return html`
    <div class="control">
      <label>
        ${c}
        repeat this track.
      </label>
    </div>
  `
}

function b (content, onclick) {
  return html`<div class="control">${_b(content, onclick)}</div>`
}

function _b (content, onclick) {
  return html`
    <a class="button" onclick=${e => {
      e.stopPropagation()
      onclick(e)
    }}>
      ${content}
    </a>
  `
}
