const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  slug string<trim>
  access_code? string<trim|length:6>
}`;

const parsedSpec = validator.parse(spec);

async function getCard(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    const card = await CreatorCard.findOne({ query: { slug: data.slug } });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    if (card.status === 'draft') {
      throwAppError(CreatorCardMessages.CARD_IS_DRAFT, ERROR_CODE.NF02);
    }

    if (card.access_type === 'private') {
      if (!data.access_code) {
        throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED_TO_VIEW, ERROR_CODE.AC03);
      }
      if (data.access_code !== card.access_code) {
        throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE, ERROR_CODE.AC04);
      }
    }

    response = {
      id: card._id,
      title: card.title,
      description: card.description,
      slug: card.slug,
      creator_reference: card.creator_reference,
      links: card.links,
      service_rates: card.service_rates,
      status: card.status,
      access_type: card.access_type,
      created: card.created,
      updated: card.updated,
      deleted: card.deleted,
    };
  } catch (error) {
    appLogger.errorX(error, 'get-creator-card-error');
    throw error;
  }

  return response;
}

module.exports = getCard;
