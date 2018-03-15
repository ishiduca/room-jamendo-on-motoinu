var d = require('global/document')
var css = require('sheetify')
var {through, pipe} = require('mississippi')
var {start, html} = require('motoinu')
var compose = require('motoinu/compose')
var apps = {
  commandButtons: require('./command-buttons'),
  searchForm: require('./search-form'),
  searchResult: require('./search-result'),
  playlist: require('./playlist'),
  audioPlayer: require('./audio-player'),
  histories: require('./histories')
}

css('./css/bulma.css')
var prefix = css`
  :host {
    padding-bottom: 300px;
  }
`
var main = html`<main></main>`
var {actions, views} = start(compose(apps, v => html`
  <main class=${prefix}>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          ${v.searchForm}
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          ${v.commandButtons}
        </div>
      </div>
    </div>
    ${v.playlist}
    <div id="wrap-search-result">
      ${v.searchResult}
    </div>
    ${v.audioPlayer}
    ${v.histories}
  </main>
`))

pipe(
  views(),
  through.obj((el, _, done) => {
    html.update(main, el)
    done()
  }),
  err => (err ? console.error(err) : console.log('FINISH'))
)

pipe(
  actions(),
  through.obj((action, _, done) => {
    console.log(action)
    done()
  }),
  err => (err ? console.error(err) : console.log('FINISH'))
)

d.body.appendChild(main)
