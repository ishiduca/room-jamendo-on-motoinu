var {html} = require('motoinu')
var {ACTIONS} = require('./actions')

module.exports = function (favs, track, onclick) {
  if (favs == null) {
    return html`
      <a class="button is-danger is-outlined" title="Disabled button" disabled>disabled</a>    
    `
  }

  return html`
    <a
      class=${favs ? 'button is-danger' : 'button is-danger is-outlined'}
      onclick=${e => {
        e.stopPropagation()
        onclick({
          type: (
            favs
              ? ACTIONS.requestFavoritesRemoveTrack
              : ACTIONS.requestFavoritesPutTrack
          ),
          payload: track
        })
      }}
    >
      ${favs ? 'Favs' : 'put Favs'}
    </a>
  `
}
