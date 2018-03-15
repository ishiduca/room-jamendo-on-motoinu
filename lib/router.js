const url = require('url')
const xtend = require('xtend')
const routington = require('routington')

module.exports = function () {
  const router = routington()
  router.def = function (p, handler) {
    var node = router.define(p)[0]
    return (node.handler = handler)
  }
  router.route = function (ecstatic) {
    return (req, res) => {
      const u = url.parse(req.url, true)
      const m = router.match(u.pathname)
      if (m == null || (m.node || {}).handler == null) ecstatic(req, res)
      else m.node.handler(req, res, xtend(u.query, m.param))
    }
  }
  return router
}
