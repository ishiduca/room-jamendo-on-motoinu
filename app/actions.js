var xtend = require('xtend')

module.exports.ACTIONS = xtend(
  wrap({
    onSearchFormInputInput: null,
    onSearchFormSelectChange: null,
    onSearchFormSubmit: null
  }, 'searchForm'),
  wrap({
    setSearchResultTitle: null,
    setSearchResultList: null,
    removeTrackFromPlaylist: null,
    onRemoveTrackFromPlaylist: null,
    registerTrackToPlaylist: null,
    onRegisterTrackToPlaylist: null,
    getRegisteredTrackFromPlaylist: null,
    onGetRegisteredTrackFromPlaylist: null,
    prepareRequestFavoritesHasTrack: null,
    onRequestFavoritesHasTrack: null,
    putFavoritesToSearchResult: null,
    removeFavoritesToSearchResult: null
  }, 'searchResult'),
  wrap({
    shufflePlaylistList: null,
    findNextTrack: null,
    onFocusNowOnPlaying: null,
    togglePlaylistRepeat: null,
    putFavoritesToPlaylist: null,
    removeFavoritesToPlaylist: null
  }, 'playlist'),
  wrap({
    putFavoritesToAudioPlayer: null,
    removeFavoritesToAudioPlayer: null,
    focusNowOnPlaying: null,
    setNowOnPlaying: null,
    onAuidoPlayerEnded: null
  }, 'audioPlayer'),
  wrap({
    smoothScroll: null
  }, 'dom'),
  wrap({
    pushHistory: null,
    hideHistories: null,
    showHistories: null,
    importHistoryToSearchResult: null
  }, 'histories'),
  wrap({
    requestFavoritesPutTrack: null,
    requestFavoritesRemoveTrack: null,
    requestFavoritesGetTracks: null
  }, 'xhr'),
  wrap({
    errors: null
  }, 'errors')
)

module.exports.EFFECTS = xtend(
  wrap({
    GET_REGISTERED_TRACK_FROM_PLAYLIST: null,
    ON_GET_REGISTERED_TRACK_FROM_PLAYLIST: null,
    ON_REGISTER_TRACK_TO_PLAYLIST: null,
    ON_REMOVE_TRACK_FROM_PLAYLIST: null
  }, 'SEARCH_RESULT'),
  wrap({
    PREPARE_FOCUS_NOW_ON_PLAYING: null,
    FOCUS_NOW_ON_PLAYING: null,
    ON_FOCUS_NOW_ON_PLAYING: null,
    ON_AUDIOPLAYER_ENDED: null
  }, 'AUDIO_PLAYER'),
  wrap({
    REQUEST_SEARCH_TRACKS: null,
    REQUEST_FAVORITES_HASTRACK: null,
    REQUEST_FAVORITES_GETTRACKS: null,
    REQUEST_FAVORITES_PUTTRACK: null,
    REQUEST_FAVORITES_REMOVETRACK: null
  }, 'XHR'),
  wrap({
    SMOOTH_SCROLL: null
  }, 'DOM'),
  wrap({
    IMPORT_HISTORY_TO_SEARCHRESULT: null
  }, 'HISTORIES')
)

function wrap (o, ns) {
  return Object.keys(o).reduce((x, a) => ((x[a] = `${ns}:${a}`) && x), {})
}
