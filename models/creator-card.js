const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator-cards';

/**
 * @typedef {Object} ModelSchema
 * @property {String} _id
 * @property {String} title
 * @property {String} description
 * @property {String} slug
 * @property {String} creator_reference
 * @property {Object[]} links
 * @property {Object} service_rates
 * @property {String} status
 * @property {String} access_type
 * @property {String} access_code
 * @property {Number} created
 * @property {Number} updated
 * @property {Number} deleted
 */

const schemaDefinition = {
  _id: { type: SchemaTypes.ULID, required: true },
  title: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String },
  slug: { type: SchemaTypes.String, required: true, index: { unique: true } },
  creator_reference: { type: SchemaTypes.String, required: true },
  links: [
    {
      title: { type: SchemaTypes.String, required: true },
      url: { type: SchemaTypes.String, required: true },
    },
  ],
  service_rates: {
    currency: { type: SchemaTypes.String, enum: ['NGN', 'USD', 'GBP', 'GHS'] },
    rates: [
      {
        name: { type: SchemaTypes.String, required: true },
        description: { type: SchemaTypes.String },
        amount: { type: SchemaTypes.Number, required: true },
      },
    ],
  },
  status: { type: SchemaTypes.String, required: true, enum: ['draft', 'published'] },
  access_type: {
    type: SchemaTypes.String,
    enum: ['public', 'private'],
    default: 'public',
  },
  access_code: { type: SchemaTypes.String },
  created: { type: SchemaTypes.Number, required: true },
  updated: { type: SchemaTypes.Number, required: true },
  deleted: { type: SchemaTypes.Number, default: 0, index: true },
};

const modelSchema = new ModelSchema(schemaDefinition, { collection: modelName });

/** @type {ModelSchema} */
module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });
