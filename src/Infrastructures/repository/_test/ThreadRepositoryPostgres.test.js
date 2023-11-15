const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
// const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('a ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread title', body: 'thread content', owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      // Action
      await threadRepositoryPostgres.addThread(addThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      // Assert
      expect(thread).toHaveLength(1);
    });
    it('should return addedThread correctyly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread title', body: 'thread content', owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.owner,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should getThread data properly ', async () => {
      // Arrange
      const addThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
      };
      const fakeIdGenerator = {};
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread(addThread);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(addThread.id);
      // Assert
      expect(thread.id).toEqual(addThread.id);
      expect(thread.title).toEqual(addThread.title);
      expect(thread.body).toEqual(addThread.body);
      expect(thread.date).toBeInstanceOf(Date);
      expect(thread.username).toEqual('dicoding');
    });
  });

  describe('a verifyThreadById function', () => {
    it('should throw NotFoundError if thread is not present', async () => {
      // Arrange
      const id = 'thread-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadById(id))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if thread is present', async () => {
      // Arrange
      const id = 'thread-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadById(id))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
