const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('addComment function should add comment correctly', async () => {
      // arrange

      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-xyz',
        owner: 'user-xyz',
      });
      const fakeIdGenerator = () => 'xyz';
      const fakeDateGenerator = {
        toISOString: () => '31-12-2021',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, fakeDateGenerator);

      // action
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });
      const addedComment = await commentRepositoryPostgres.addComment(addComment);
      const comments = await CommentsTableTestHelper.findCommentById(addedComment.id);

      // assert
      expect(addedComment).toStrictEqual({
        id: 'comment-xyz',
        content: addComment.content,
        owner: addComment.owner,
      });
      expect(comments).toBeDefined();
    });
  });

  describe('deleteComment', () => {
    it('should be able to delete added comment', async () => {
    // arrange
      const addedComment = {
        id: 'comment-xyz',
        threadId: 'thread-xyz',
      };

      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });

      await CommentsTableTestHelper.addComment({
        id: addedComment.id, threadId: addedComment.threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // action
      await commentRepositoryPostgres.deleteComment(addedComment.id);
      const comment = await CommentsTableTestHelper.findCommentById('comment-xyz');

      // assert
      expect(comment.is_delete).toEqual(true);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should not throw error if user is comment owner of the comment', async () => {
      const commentId = 'comment-xyz';
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {}, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-xyz')).resolves.toBeUndefined();
    });

    it('should throw error if user is not owner of the comment', async () => {
      const commentId = 'comment-xyz';
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: 'thread-xyz', owner: 'user-xyz' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-abc')).rejects.toThrowError('Anda tidak berhak mengakses resource ini');
    });
    it('should throw error if comment does not exist', async () => {
      const commentId = 'comment-xyz';
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: 'thread-xyz', owner: 'user-xyz' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-wok', 'user-xyz')).rejects.toThrowError('Comment tidak ditemukan');
    });
  });

  describe('checkAvailabilityComment', () => {
    it('should resolve if comment exists', async () => {
      const commentId = 'comment-xyz';
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await expect(commentRepositoryPostgres.checkAvailabilityComment(commentId))
        .resolves.not.toThrowError();
    });

    it('should reject if comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      const commentId = 'comment-xyz';
      await expect(commentRepositoryPostgres.checkAvailabilityComment(commentId))
        .rejects.toThrowError('comment tidak ditemukan di database');
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return all comments from a thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-xyz', title: 'Dicoding', body: 'Dicoding Indonsia Raya', owner: 'user-xyz', date: '31-12-2021',
      });

      const firstComment = {
        id: 'comment-mno', date: '1-1-2022', content: 'first comment',
      };
      const secondComment = {
        id: 'comment-abc', date: '2-1-2022', content: 'second comment',
      };
      const thirdComment = {
        id: 'comment-xyz', date: '3-1-2022', content: 'third comment',
      };
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);
      await CommentsTableTestHelper.addComment(thirdComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-xyz');
      expect(commentDetails).toEqual([
        { ...firstComment, is_delete: false, username: 'dicoding' },
        { ...secondComment, is_delete: false, username: 'dicoding' },
        { ...thirdComment, is_delete: false, username: 'dicoding' },
      ]);
    });

    it('should return an empty array when no comments exist for the thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-xyz');
      expect(commentDetails).toStrictEqual([]);
    });
  });
});
