module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    repeat: {
      type: 'boolean',
      required: true
    },
    list: {
      type: 'array',
      items: {
        type: 'object',
        required: true,
        additionalProperties: false,
        properties: {
          favs: {
            type: ['boolean', 'null'],
            required: true
          },
          focus: {
            type: ['boolean', 'null'],
            required: true
          },
          _: require('./track')
        }
      }
    }
  }
}
