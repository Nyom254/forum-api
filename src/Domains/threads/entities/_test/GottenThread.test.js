const GottenThread = require('../GottenThread');

describe('GottenThread entities', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'thread body',
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
    };

    // Assert & Action
    expect(() => new GottenThread(payload)).toThrowError('GOTTEN_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      body: [],
      date: true,
      username: 'dicoding',
      comments: {
        id: 'comment-123',
        username: 'galang',
        date: '2021-08-08T07:19:09.775Z',
        content: 'comment content',
      },
    };

    // Assert & Action
    expect(() => new GottenThread(payload)).toThrowError('GOTTEN_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GottenThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'thread body',
      date: new Date('2021-08-08T07:19:09.775Z'),
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
    };

    // Action
    const gottenThread = new GottenThread(payload);
    // Action
    expect(gottenThread.id).toEqual(payload.id);
    expect(gottenThread.title).toEqual(payload.title);
    expect(gottenThread.body).toEqual(payload.body);
    expect(gottenThread.date).toEqual(payload.date);
    expect(gottenThread.username).toEqual(payload.username);
    expect(gottenThread.comments).toEqual(payload.comments);
  });
});
