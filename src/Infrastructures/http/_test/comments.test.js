const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('comment endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread', async () => {
      // arrange
      const requestPayload = {
        content: 'sebuah komen',
      };

      const server = await createServer(container);

      /* login and add thread to get accessToken and threadId */
      const { accessToken, userId } = await ServerTestHelper
        .getAccessToken(server, 'dicoding');
      const threadId = 'thread-xyz';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should respond with 400 when comment payload has wrong data type specifications', async () => {
      // arrange
      /* add comment payload with bad specifications */
      const requestPayload = {
        content: 1234,
      };

      const server = await createServer(container);

      /* login and add thread to get accessToken and threadId */
      const { accessToken, userId } = await ServerTestHelper
        .getAccessToken(server, 'dicoding');
      const threadId = 'thread-xyz';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should respond with 400 when comment payload has missing specificiations', async () => {
      // arrange
      /* add comment payload with bad specifications */
      const requestPayload = {};
      const server = await createServer(container);

      /* login and add thread to get accessToken and threadId */
      const { accessToken, userId } = await ServerTestHelper
        .getAccessToken(server, 'dicoding');
      const threadId = 'thread-xyz';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with 200 and return success status', async () => {
      // arrange
      const server = await createServer(container);

      const { userId, accessToken } = await ServerTestHelper
        .getAccessToken(server, 'dicoding');

      const threadId = 'thread-xyz';
      const commentId = 'comment-xyz';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 200 with thread details and comments after comment deletion', async () => {
      const server = await createServer(container);

      const threadId = 'thread-xyz';
      const commentId = 'comment-xyz';
      const ownerComment = 'dicoding';
      const { accessToken, userId } = await ServerTestHelper
        .getAccessToken(server, ownerComment);
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: 'JohnDoe' });
      await ThreadTableTestHelper.addThread({ id: threadId, owner: 'user-xyz' });
      await CommentsTableTestHelper.addComment({
        id: commentId, threadId, owner: userId, date: '31-12-2020',
      });
      await CommentsTableTestHelper.addComment({ id: 'comment-abc', threadId, owner: 'user-xyz' });

      // action
      const responseDelete = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseThread = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(responseThread.payload);
      expect(responseThread.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should respond with 403 when owner is unauthorized', async () => {
    // arrange
      const server = await createServer(container);

      /* create first user and their comment */
      const { userId: userId1 } = await ServerTestHelper
        .getAccessToken(server, 'dicoding');
      const threadId1 = 'thread-xyz';
      const commentId1 = 'comment-xyz';
      await ThreadTableTestHelper.addThread({ id: threadId1, owner: userId1 });
      await CommentsTableTestHelper.addComment({ id: commentId1, owner: userId1 });

      /* create second user */
      const { accessToken: accessToken2, userId: userId2 } = await ServerTestHelper
        .getAccessToken(server, 'dicoding2');

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId1}/comments/${commentId1}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});