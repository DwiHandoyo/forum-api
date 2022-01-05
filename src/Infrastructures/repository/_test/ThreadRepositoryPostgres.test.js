const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should create new thread and return added thread correctly', async () => {
      // arrange

      /* arranging for add pe-existing */
      await UsersTableTestHelper.addUser({
        id: 'user-xyz',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      /* arranging for mocks and stubs for thread repository */
      const fakeIdGenerator = () => 'thread-xyz';
      const fakeDateGenerator = {
        toISOString: () => '31-12-2021',
      };

      /* arranging for thread repository */
      const addThread = new AddThread({
        title: 'Dicoding Indonesia',
        body: 'hehe wkwk',
        owner: 'user-xyz',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeDateGenerator);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // assert
      const threads = await ThreadTableTestHelper.findThreadById(addedThread.id);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: `thread-${fakeIdGenerator()}`,
        title: 'Dicoding Indonesia',
        owner: 'user-xyz',
      }));
      expect(threads).toBeDefined();
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should return NotFoundError when thread is not found', async () => {
      // arrange
      const threadId = 'thread-xyz';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
      await UsersTableTestHelper.addUser({ id: 'user-xyz' });
      await ThreadTableTestHelper.addThread({ id: threadId, owner: 'user-xyz' });

      // action & assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-xy'))
        .rejects
        .toThrowError(NotFoundError);
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-xy'))
        .rejects.toThrowError('thread tidak ditemukan di database');
    });
    it('should not return error when thread is not found', async () => {
      // arrange
      const threadId = 'thread-xyz';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
      await UsersTableTestHelper.addUser({ id: 'user-xyz' });
      await ThreadTableTestHelper.addThread({ id: threadId, owner: 'user-xyz' });

      // action & assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should return thread when thread is found', async () => {
      // arrange
      const addThread = {
        id: 'thread-xyz', title: 'Dicoding Indonesia', body: 'Dicoding Indonesia !!!!', owner: 'user-xyz', date: '31-12-2021',
      };
      const expectedThread = {
        id: 'thread-xyz',
        title: 'Dicoding Indonesia',
        date: '31-12-2021',
        username: 'Dicoding',
        body: 'Dicoding Indonesia !!!!',
      };
      /* arranging for thread repository */

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: expectedThread.username });
      await ThreadTableTestHelper.addThread(addThread);

      // action
      const foundThread = await threadRepositoryPostgres.getThreadbyId('thread-xyz');

      // assert
      expect(foundThread).toStrictEqual(expectedThread);
    });
  });
});
