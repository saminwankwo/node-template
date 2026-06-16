const { createHandler } = require('@app-core/server');
const createCardService = require('@app/services/creator-cards/create-card');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  handler: async (requestComponents, helpers) => {
    const { body } = requestComponents;
    const data = await createCardService(body);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Created Successfully.',
      data,
    };
  },
});
