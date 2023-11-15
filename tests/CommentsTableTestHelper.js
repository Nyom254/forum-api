/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah komentar',
    owner = 'user-123',
    thread = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, owner, thread) VALUES ($1, $2, $3, $4)',
      values: [id, content, owner, thread],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments where 1=1');
  },
};

module.exports = CommentsTableTestHelper;
