class sayHiHandler {
  async getSayHi() {
    return {
      status: 'success',
      data: 'hiii!',
    };
  }
}

module.exports = sayHiHandler;
