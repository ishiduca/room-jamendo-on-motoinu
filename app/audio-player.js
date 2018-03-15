var {html} = require('motoinu')
var d = require('global/document')
var xtend = require('xtend')
var css = require('sheetify')
var onload = require('on-load')
var {through} = require('mississippi')
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')
var bFavs = require('./favorites-button')
var prefix = css`
  :host {
    position: fixed;
    z-index: 99;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 12px;
    background-color: rgba(0, 0, 0, .85);
    color: #aaaaaa;
  }
`

var DOCUMENT_TITTLE = d.title

module.exports = {
  init () {
    return {
      model: null
    }
  },
  update: update({
    [ACTIONS.focusNowOnPlaying] (model, payload) {
      return {
        model: null,
        effect: {
          type: EFFECTS.FOCUS_NOW_ON_PLAYING,
          payload: payload
        }
      }
    },
    [ACTIONS.setNowOnPlaying] (model, payload) {
      return {
        model: payload,
        effect: {
          type: EFFECTS.ON_FOCUS_NOW_ON_PLAYING,
          payload: payload
        }
      }
    },
    [ACTIONS.putFavoritesToAudioPlayer] (model, payload) {
      if (payload !== model._.id) return {model}
      return {model: xtend(model, {favs: true})}
    },
    [ACTIONS.removeFavoritesToAudioPlayer] (model, payload) {
      if (payload !== model._.id) return {model}
      return {model: xtend(model, {favs: false})}
    },
    [ACTIONS.onAudioPlayerEnded] (model, payload) {
      return {model: model, effect: {type: EFFECTS.ON_AUDIOPLAYER_ENDED}}
    }
  }),
  run: run({
    [EFFECTS.FOCUS_NOW_ON_PLAYING] (payload) {
      var s = through.obj()
      setTimeout(() => s.end({
        type: ACTIONS.setNowOnPlaying,
        payload: payload
      }), 10)
      return s
    },
    [EFFECTS.ON_FOCUS_NOW_ON_PLAYING] (payload) {
      var s = through.obj()
      s.end({
        type: ACTIONS.onFocusNowOnPlaying,
        payload: payload._.id
      })
      d.title = `${payload._.name} | ${payload._.artist_name}`
      return s
    },
    [EFFECTS.ON_AUDIOPLAYER_ENDED] (payload) {
      d.title = DOCUMENT_TITTLE
    }
  }),
  view (model, actionsUp) {
    if (model == null) return html`<div></div>`
    return html`
      <div class=${prefix}>
        <article class="media">
          <figure class="media-left">
            <p class="image">
              <img src=${model._.image} />
            </p>
          </figure>
          <div class="media-content">
            ${audio(model._.audio, e => {
              actionsUp({
                type: ACTIONS.findNextTrack,
                payload: +1
              })
              actionsUp({
                type: ACTIONS.onAudioPlayerEnded
              })
            })}
            <div class="content">
              <p>
                <strong>
                  <a
                    target="_blank" rel="noreferrer noopener"
                    href=${model._.shareurl}
                  >
                    ${model._.name}
                  </a>
                </strong>
                <br />
                <span>(via ${model._.album_name || 'single'})</span>
                <br />
                <span>${model._.artist_name}</span>
              </p>
            </div>
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  ${bFavs(model.favs, model._, actionsUp)}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    `
  }
}

function audio (src, onended) {
  var p = html`
    <audio
      preload="metadata"
      controls
      src=${src}
      onended=${e => {
        e.stopPropagation()
        onended(e)
      }}
    >
      <p>:(</p>
    </audio>
  `
  onload(p, p => p.play(), p => {
    p.removeAttribute('src')
    p.load()
  })
  return p
}
