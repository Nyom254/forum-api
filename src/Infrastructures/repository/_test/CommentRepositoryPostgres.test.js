const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('add comment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah komentar',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({
        id: addComment.owner,
      });
      await ThreadsTableTestHelper.addThread({
        id: addComment.thread,
      });

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah komentar',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({
        id: addComment.owner,
      });
      await ThreadsTableTestHelper.addThread({
        id: addComment.thread,
      });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('check comment by id function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const id = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentById(id))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      const id = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id });

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentById(id))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verify comment owner function', () => {
    it('should throw AuthorizationError when comment owner is not the same as the given user', async () => {
      // Arrange
      const id = 'comment-123';
      const userId = 'user-321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(id, userId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner is the same as the given user', async () => {
      // Arrange
      const id = 'comment-123';
      const userId = 'user-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(id, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('delete comment function', () => {
    it('should update comments table is_delete column  from database', async () => {
      // Arrange
      const id = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id });
      // Action
      await commentRepositoryPostgres.deleteCommentById(id);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(id);
      expect(comment[0].is_delete).toEqual(true);
    });
  });
});
