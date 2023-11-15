class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { id, user } = payload;
    await this._commentRepository.checkCommentById(id);
    await this._commentRepository.verifyCommentOwner(id, user);
    await this._commentRepository.deleteCommentById(id);
  }

  _verifyPayload({ id, user }) {
    if (!id || !user) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof user !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
