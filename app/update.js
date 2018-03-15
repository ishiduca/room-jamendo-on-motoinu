var defined = require('defined')
module.exports.update = function (actions) {
  return (model, action) => {
    var update = actions[action.type]
    if (update == null) return {model}
    return defined(update(model, action.payload), {model})
  }
}

module.exports.run = function (effects) {
  return (effect, sources) => {
    var run = effects[effect.type]
    if (run != null) return run(effect.payload, sources)
  }
}
