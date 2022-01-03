const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
// const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
// const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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
      const fakeDateGenerator =  {
        toISOString : () => '31-12-2021',
      };

      /* arranging for thread repository */
      const addThread = new AddThread({
        title: 'Dicoding Indonesia',
        body: 'hehe wkwk',
        owner: 'user-xyz',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool, fakeIdGenerator, fakeDateGenerator,
      );

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

  describe('checkAvailabilityThread function', () => {
    it('should return NotFoundError when thread is not found', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
      await UsersTableTestHelper.addUser({ id: 'user-xyz' });
      await ThreadTableTestHelper.addThread({ id: 'thread-xyz', owner: 'user-xyz' });

      // action & assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-xy'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});