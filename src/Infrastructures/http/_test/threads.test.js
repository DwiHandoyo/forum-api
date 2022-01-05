const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTableTestHelper');
const container = require('../../container');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/thread endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /thread', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessToken(server, 'Dicoding');
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        body: 'secret',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessToken(server, 'Dicoding');
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan title');
    });

    it('should response 400 when title more than 100 character', async () => {
      // Arrange
      const payload = {
        title: 'dicodingdicodingdicodingdicodingdicodingdicodingdicodingdicodingdicodingdicodingdicodingdicodingdicoding',
        body: 'dummy body',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessToken(server, 'Dicoding');
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should response 401 when authentictaion is missing', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
      };
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 with thread details and comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-xyz';
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: 'JohnDoe' });
      await UsersTableTestHelper.addUser({ id: 'user-abc', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: threadId, owner: 'user-xyz' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-xyz', threadId, owner: 'user-xyz', date: '31-12-2020',
      });
      await CommentsTableTestHelper.addComment({ id: 'comment-abc', threadId, owner: 'user-xyz' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should respond with 200 and with thread details with empty comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-xyz';
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: 'John Doe' });
      await ThreadTableTestHelper.addThread({ id: threadId, owner: 'user-xyz' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });
  });
});
