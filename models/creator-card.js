const mongoose = require('mongoose');
const { generateSchema } = require('@app-core/mongoose');

const schemaDefinition = {
  _id: {
    type: String,
    default: () => require('@app-core/randomness').ulid(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  creator_reference: {
    type: String,
    required: true,
  },
  links: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  service_rates: {
    currency: {
      type: String,
      enum: ['NGN', 'USD', 'GBP', 'GHS'],
    },
    rates: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    required: true,
  },
  access_type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  access_code: {
    type: String,
  },
  created: {
    type: Number,
    default: () => Date.now(),
  },
  updated: {
    type: Number,
    default: () => Date.now(),
  },
  deleted: {
    type: Number,
  },
};

const creatorCardSchema = generateSchema(schemaDefinition, {
  paranoid: true,
});

module.exports = mongoose.model('CreatorCard', creatorCardSchema);
