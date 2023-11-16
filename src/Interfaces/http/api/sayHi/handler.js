class SayHiHandler {
  async getSayHiHandler() {
    return {
      status: 'success',
      data: 'hi!!',
    };
  }
}

module.exports = SayHiHandler;
