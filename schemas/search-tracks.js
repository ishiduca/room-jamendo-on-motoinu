module.exports = {
  title: 'tracks',
  type: 'object',
  additionalProperties: false,
  properties: {
    client_id: {
      type: 'string',
      pattern: '^[0-9a-zA-Z]{8}$',
      required: true
    },
    format: {
      type: 'string',
      enum: ['xml', 'json', 'jsonpretty']
    },
    offset: {
      type: 'integer'
    },
    limit: {
      type: ['integer', 'string']
    },
    order: {
      type: 'string',
      enum: ['relevance', 'buzzrate', 'downloads_week', 'downloads_month', 'downloads_total', 'listens_week', 'listens_month', 'listens_total', 'popularity_week', 'popularity_month', 'popularity_total', 'name', 'album_name', 'artist_name', 'releasedate', 'duration', 'id']
    },
    id: {
      type: 'array',
      items: {
        type: 'integer'
      }
    },
    name: {
      type: 'string'
    },
    namesearch: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['single', 'albumtrack', 'single albumtrack']
    },
    album_id: {
      type: 'array',
      items: {
        type: 'integer'
      }
    },
    album_name: {
      type: 'string'
    },
    artist_id: {
      type: 'array',
      items: {
        type: 'integer'
      }
    },
    artist_name: {
      type: 'string'
    },
    datebetween: {
      type: 'string',
      pattern: '^20\\d\\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])_20\\d\\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$'
    },
    featured: {
      type: 'boolean',
      enum: [true]
    },
    imagesize: {
      type: 'integer',
      enum: [25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600]
    },
    audioformat: {
      type: 'string',
      enum: ['mp31', 'mp32', 'ogg', 'flac']
    },
    audiodlformat: {
      type: 'string',
      enum: ['mp31', 'mp32', 'ogg', 'flac']
    },
    tags: {
      type: 'string'
    },
    fuzzytags: {
      type: 'string'
    },
    acousticelectric: {
      type: 'string',
      enum: ['acoustic', 'electric']
    },
    vocalinstrumental: {
      type: 'string',
      enum: ['vocal', 'instrumental']
    },
    gender: {
      type: 'string',
      enum: ['female', 'male']
    },
    speed: {
      type: 'string',
      enum: ['verylow', 'low', 'medium', 'high', 'veryhigh']
    },
    search: {
      type: 'string'
    }
  }
}
