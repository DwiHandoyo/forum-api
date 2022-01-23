const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, dateGenerator, mapDb) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
    this._mapDb = mapDb;
  }

  async addComment(addComment) {
    const { threadId, content, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = this._dateGenerator.toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner],
    };
    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async checkAvailabilityComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('comment tidak ditemukan di database');
    }
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [comment],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete
      FROM comments
      LEFT JOIN users ON comments.owner = users.id
      WHERE thread_id = $1
      ORDER BY date ASC `,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
