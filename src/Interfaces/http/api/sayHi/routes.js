const routes = (handler) => [
  {
    method: 'GET',
    path: '/hi',
    handler: handler.getSayHi,
  },
];

module.exports = routes;
