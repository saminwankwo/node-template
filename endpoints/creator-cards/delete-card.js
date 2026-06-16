const { createHandler } = require('@app-core/server');
const deleteCardService = require('@app/services/creator-cards/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  handler: async (requestComponents, helpers) => {
    const { params, body } = requestComponents;
    const data = await deleteCardService({
      slug: params.slug,
      creator_reference: body.creator_reference,
    });
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Deleted Successfully.',
      data,
    };
  },
});
