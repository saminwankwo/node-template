const createHandler = require('@app-core/express/create-handler');
const createCardService = require('@app/services/creator-cards/create-card');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  handler: async (requestComponents) => {
    const { body } = requestComponents;
    const data = await createCardService(body);
    return {
      message: 'Creator card created successfully',
      data,
    };
  },
});
