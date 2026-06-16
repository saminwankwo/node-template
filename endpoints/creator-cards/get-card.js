const createHandler = require('@app-core/express/create-handler');
const getCardService = require('@app/services/creator-cards/get-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  handler: async (requestComponents) => {
    const { params, query } = requestComponents;
    const data = await getCardService({
      slug: params.slug,
      access_code: query.access_code,
    });
    return {
      message: 'Creator card retrieved successfully',
      data,
    };
  },
});
