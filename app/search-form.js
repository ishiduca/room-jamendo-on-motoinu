var {html} = require('motoinu')
var {through} = require('mississippi')
var {post} = require('jsonist')
var xtend = require('xtend')
var w = require('global/window')
var l = w.location
var home = `${l.protocol}//${l.host}`
var {ACTIONS, EFFECTS} = require('./actions')
var {update, run} = require('./update')
module.exports = {
  init () {
    return {
      model: {
        select: [
          {value: '', text: '*select category*', selected: true},
          {value: 'name', text: 'track name'},
          {value: 'namesearch', text: 'search by a track by name'},
          {value: 'album_name', text: 'album name'},
          {value: 'artist_name', text: 'artist name'},
          {value: 'tags', text: 'tag (AND)'},
          {value: 'fuzzytags', text: 'tag (OR)'},
          {value: 'search', text: 'free text'}
        ],
        input: {
          value: '',
          placeholder: 'search your favorite music!'
        }
      }
    }
  },
  update: update({
    [ACTIONS.onSearchFormInputInput] (model, payload) {
      return {model: xtend(model, {input: xtend(model.input, {value: payload})})}
    },
    [ACTIONS.onSearchFormSelectChange] (model, payload) {
      return {model: xtend(model, {select: model.select.map((o, i) => (
        i === payload ? xtend(o, {selected: true}) : xtend(o, {selected: false})
      ))})}
    },
    [ACTIONS.onSearchFormSubmit] (model) {
      return {model: model, effect: {type: EFFECTS.REQUEST_SEARCH_TRACKS, payload: model}}
    }
  }),
  run: run({
    [EFFECTS.REQUEST_SEARCH_TRACKS] (payload) {
      var s = through.obj()
      var key = payload.select.filter(o => o.selected).map(o => o.value)[0]
      var val = payload.input.value.split(' ').filter(Boolean).join(' ')
      var title = `${key}:${val}`
      post(`${home}/search/tracks`, {[key]: val}, (err, data, res) => {
        if (data.headers) console.log(data.headers)
        if (err || data.errors) {
          s.end({
            type: ACTIONS.errors,
            payload: err || data.erros
          })
          return console.error(err || data.errors)
        }
        if (data.results && data.results.length > 0) {
          s.write({
            type: ACTIONS.prepareRequestFavoritesHasTrack,
            payload: data.results
          })
        }
        s.write({
          type: ACTIONS.pushHistory,
          payload: {
            title: title,
            list: data.results
          }
        })
        s.end({
          type: ACTIONS.setSearchResultList,
          payload: data.results.map(t => ({_: t, selected: null, favs: null}))
        })
      })

      s.write({
        type: ACTIONS.setSearchResultTitle,
        payload: title
      })
      return s
    }
  }),
  view (model, actionsUp) {
    return html`
      <section>
        <form onsubmit=${e => {
          e.preventDefault()
          actionsUp({type: ACTIONS.onSearchFormSubmit})
        }}
        >
          <div class="field has-addons">
            <div class="control">
              <div class="select">
                <select
                  onchange=${e => {
                    e.stopPropagation()
                    actionsUp({
                      type: ACTIONS.onSearchFormSelectChange,
                      payload: e.target.selectedIndex
                    })
                  }}
                  required
                >
                  ${model.select.map(opt => (
                    opt.selected
                      ? html`<option value=${opt.value} selected>${opt.text}</option>`
                      : html`<option value=${opt.value}>${opt.text}</option>`
                  ))}
                </select>
              </div>
            </div>
            <div class="control">
              <input class="input"
                type="text"
                required
                autofocus
                placeholder=${model.input.placeholder}
                value=${model.input.value}
                oninput=${e => {
                  e.stopPropagation()
                  actionsUp({
                    type: ACTIONS.onSearchFormInputInput,
                    payload: e.target.value
                  })
                }}
              />
            </div>
          </div>
        </form>
      </section>
    `
  }
}
