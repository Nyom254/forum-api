const routes = (handler) => [
  {
    method: 'GET',
    path: '/hi',
    handler: handler.getSayHiHandler,
  },
];

module.exports = routes;
