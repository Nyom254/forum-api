const GetThreadUseCase = require('../GetThreadUseCase');
const GottenThread = require('../../../Domains/threads/entities/GottenThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain thread id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Assert & Action
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const getThreadUseCase = new GetThreadUseCase({});

    // Assert & Action
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the GetThreadUseCase properly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // create use case dependency
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking function
    mockThreadRepository.verifyThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread content',
        date: new Date('2021-08-08T07:22:33.555Z'),
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'galang',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'comment content',
        },
        {
          id: 'comment-321',
          username: 'boby',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: '** komentar telah dihapus **',
        },
      ]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const gottenThread = await getThreadUseCase.execute(useCasePayload);
    // Assert
    expect(gottenThread).toStrictEqual(new GottenThread({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread content',
      date: new Date('2021-08-08T07:22:33.555Z'),
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'galang',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'comment content',
        },
        {
          id: 'comment-321',
          username: 'boby',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: '** komentar telah dihapus **',
        },
      ],
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});
