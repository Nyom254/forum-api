const GottenThread = require('../../Domains/threads/entities/GottenThread');

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validateUseCasePayload(useCasePayload);

    const { threadId } = useCasePayload;
    await this.threadRepository.verifyThreadById(threadId);
    const threadPayload = await this.threadRepository.getThreadById(threadId);
    const commentPayload = await this.commentRepository.getCommentByThreadId(threadId);
    return new GottenThread({
      ...threadPayload,
      comments: commentPayload,
    });
  }

  _validateUseCasePayload({ threadId }) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
