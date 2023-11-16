const SayHiHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'sayHi',
  register: async (server) => {
    server.route(routes(new SayHiHandler()));
  },
};
