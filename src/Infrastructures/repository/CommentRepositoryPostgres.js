const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedThread = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, thread } = addComment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, content, owner, thread) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, thread],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async checkCommentById(id) {
    const query = {
      text: 'SELECT id from comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak dapat ditemukan');
    }
  }

  async verifyCommentOwner(id, user) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== user) {
      throw new AuthorizationError('Anda tidak diperbolehkan untuk mengakses resources ini');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: "SELECT comments.id, users.username, comments.date, CASE WHEN comments.is_delete = true THEN '**komentar telah dihapus**' ELSE comments.content END AS content FROM comments INNER JOIN users ON users.id = comments.owner WHERE comments.thread = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
