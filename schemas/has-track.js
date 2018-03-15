module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tracks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: ['string', 'integer'],
          required: true
        }
      }
    }
  }
}
