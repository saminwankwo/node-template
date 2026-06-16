const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  slug string<trim>
  creator_reference string<trim|length:20>
}`;

const parsedSpec = validator.parse(spec);

async function deleteCard(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    const card = await CreatorCard.findOne({ query: { slug: data.slug } });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    await CreatorCard.deleteOne({ query: { _id: card._id } });

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
      access_code: card.access_code,
      created: card.created,
      updated: card.updated,
      deleted: Date.now(),
    };
  } catch (error) {
    appLogger.errorX(error, 'delete-creator-card-error');
    throw error;
  }

  return response;
}

module.exports = deleteCard;
