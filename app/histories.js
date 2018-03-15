var {html} = require('motoinu')
var css = require('sheetify')
var xtend = require('xtend')
var isEmpty = require('is-empty')
var {through} = require('mississippi')
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')
var prefix = css`
  :host {}
  :host .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .8);
  }
`
var HISTORIES = []

module.exports = {
  init () {
    return {
      model: {
        histories: null
      }
    }
  },
  update: update({
    [ACTIONS.pushHistory] (model, payload) {
      var keys = HISTORIES.reduce((x, p) => (
        (x[p.title.toUpperCase()] = true) && x
      ), {})
      if (keys[payload.title.toUpperCase()]) return {model}
      HISTORIES.push(payload)
      if (model.histories != null) return {model: xtend(model, {histories: HISTORIES})}
    },
    [ACTIONS.showHistories] (model, payload) {
      if (isEmpty(HISTORIES)) return {model}
      return {model: xtend(model, {histories: HISTORIES})}
    },
    [ACTIONS.hideHistories] (model, payload) {
      return {model: xtend(model, {histories: null})}
    },
    [ACTIONS.importHistoryToSearchResult] (model, payload) {
      return {
        model: model,
        effect: {
          type: EFFECTS.IMPORT_HISTORY_TO_SEARCHRESULT,
          payload: payload
        }
      }
    }
  }),
  run: run({
    [EFFECTS.IMPORT_HISTORY_TO_SEARCHRESULT] (payload) {
      var s = through.obj()
      s.write({
        type: ACTIONS.setSearchResultTitle,
        payload: payload.title
      })
      s.write({
        type: ACTIONS.prepareRequestFavoritesHasTrack,
        payload: payload.list
      })
      s.end({
        type: ACTIONS.setSearchResultList,
        payload: payload.list.map(t => ({_: t, selected: null, favs: null}))
      })
      return s
    }
  }),
  view (model, actionsUp) {
    if (model.histories == null || model.histories.length === 0) return html`<div></div>`
    return html`
      <div class=${prefix}>
        <div class="modal" onclick=${e => {
          e.stopPropagation()
          actionsUp({type: ACTIONS.hideHistories})
        }}>
          <div class="buttons">
            ${model.histories.map(p => html`
              <a class="button is-rounded" onclick=${e => {
                e.stopPropagation()
                actionsUp({
                  type: ACTIONS.importHistoryToSearchResult,
                  payload: p
                })
              }}>
                ${p.title}
              </a>
            `)}
          </div>
        </div>
      </div>
    `
  }
}
