const { createHandler } = require('@app-core/server');
const getCardService = require('@app/services/creator-cards/get-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  handler: async (requestComponents, helpers) => {
    const { params, query } = requestComponents;
    const data = await getCardService({
      slug: params.slug,
      access_code: query.access_code,
    });
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Retrieved Successfully.',
      data,
    };
  },
});
