module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
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
          selected: {
            type: ['boolean', 'null'],
            required: true
          },
          _: require('./track')
        }
      }
    }
  }
}
