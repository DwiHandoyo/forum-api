const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addContent function', () => {
    it('should add content to database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const content = 'content';

      // Action
      await commentRepository.addContent(content);

      // Assert
      const contents = await CommentsTableTestHelper.findContent(content);
      expect(contents).toHaveLength(1);
      expect(contents[0].content).toBe(content);
    });
  });

  describe('checkAvailabilityContent function', () => {
    it('should throw InvariantError if content not available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = 'comment-xyz';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment(id))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if id available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = 'comment-xyz';
      await CommentsTableTestHelper.addContent(id);

      // Action & Assert
      await expect(commentRepository.checkAvailabilityContent(id))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteContent', () => {
    it('should delete content from database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const content = 'content';
      await CommentsTableTestHelper.addContent(content);

      // Action
      await commentRepository.deleteContent(content);

      // Assert
      const contents = await CommentsTableTestHelper.findContent(content);
      expect(contents).toHaveLength(0);
    });
  });
});
