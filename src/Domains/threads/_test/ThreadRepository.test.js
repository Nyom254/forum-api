const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Assert & Action
    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
