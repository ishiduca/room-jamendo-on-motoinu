const {pipe, through} = require('mississippi')
const xtend = require('xtend')

module.exports = function (storage) {
  return {
    putTrack (id, track) {
      const s = through.obj()
      storage.tracks.put(id, track, err => {
        err ? s.emit('error', err) : s.end({key: id, value: track})
      })
      return s
    },
    removeTrack (id) {
      const s = through.obj()
      storage.tracks.get(id, (err, track) => {
        if (err) return s.emit('error', err)
        storage.tracks.del(id, err => {
          err ? s.emit('error', err) : s.end({key: id, value: track})
        })
      })
      return s
    },
    getTracks (opt) {
      const s = through.obj()
      const tracks = []
      pipe(
        storage.tracks.createReadStream(),
        through.obj((p, _, done) => {
          tracks.push(p)
          done()
        }),
        err => (err ? s.emit('error', err) : s.end(tracks))
      )
      return s
    },
    hasTrack (tracks) {
      const s = through.obj()
      Promise.all(tracks.map(t => new Promise((resolve, reject) => {
        storage.tracks.get(t.id, (err, track) => (
          (err && !err.notFound) ? reject(err) : resolve({[t.id]: !err})
        ))
      })))
        .then(tracks => s.end(xtend.apply(null, tracks)))
        .catch(err => s.emit('error', err))
      return s
    }
  }
}
