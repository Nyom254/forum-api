const createServer = require('../createServer');

describe('GET /hi endpoint', () => {
  it('should response 200 and return a hi string', async () => {
    // Arrange
    const server = await createServer({});
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/hi',
    });
    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });
});
