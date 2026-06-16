const createHandler = require('@app-core/express/create-handler');
const deleteCardService = require('@app/services/creator-cards/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  handler: async (requestComponents) => {
    const { params, body } = requestComponents;
    const data = await deleteCardService({
      slug: params.slug,
      creator_reference: body.creator_reference,
    });
    return {
      message: 'Creator card deleted successfully',
      data,
    };
  },
});
