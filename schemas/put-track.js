module.exports = {
  type: 'object',
  properties: {
    id: {
      type: ['string', 'integer'],
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    image: {
      type: 'string',
      format: 'uri',
      required: true
    },
    audio: {
      type: 'string',
      format: 'uri',
      required: true
    },
    shareurl: {
      type: 'string',
      format: 'uri',
      required: true
    },
    artist_name: {
      type: 'string',
      required: true
    },
    artist_idstr: {
      type: 'string',
      required: true
    },
    artist_id: {
      type: ['string', 'integer'],
      required: true
    }
  }
}
