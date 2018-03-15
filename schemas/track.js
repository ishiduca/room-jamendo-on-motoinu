module.exports = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: /^\d+$/,
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    duration: {
      type: 'integer',
      required: true
    },
    artist_id: {
      type: 'string',
      pattern: /\d+$/,
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
    album_name: {
      type: 'string',
      required: true
    },
    album_id: {
      type: 'string',
      required: true
    },
    license_ccurl: {
      type: 'string',
      format: 'uri',
      required: true
    },
    position: {
      type: 'integer',
      required: true
    },
    releasedate: {
      type: 'string',
      pattern: /^20\d\d-\d\d-\d\d$/,
      required: true
    },
    album_image: {
      type: 'string',
      required: true
    },
    audio: {
      type: 'string',
      required: true,
      format: 'uri'
    },
    audiodownload: {
      type: 'string',
      required: true,
      format: 'uri'
    },
    prourl: {
      type: 'string',
      required: true
    },
    shorturl: {
      type: 'string',
      required: true,
      format: 'uri'
    },
    shareurl: {
      type: 'string',
      required: true,
      format: 'uri'
    },
    image: {
      type: 'string',
      required: true,
      format: 'uri'
    }
  }
}
