const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread');
const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailUseCase', () => {
  describe('execute', () => {
    it('should orchestrate the get thread detail action correctly', async () => {
      // arrange
      const useCaseParam = {
        threadId: 'thread-abc',
      };

      const thread = {
        id: 'thread-abc4',
        title: 'title',
        body: 'body',
        date: '31-12-2020',
        username: 'John Doe',
      };

      const threadComments = [
        {
          id: 'comment-abc',
          username: 'dicoding',
          date: '2021',
          content: 'comment A',
          is_delete: false,
        },
        {
          id: 'comment-def',
          username: 'john',
          date: '31-12-2020',
          content: 'comment B',
          is_delete: true,
        },
      ];

      const expectedThreadComments = [
        new DetailedComment({
          id: 'comment-abc',
          username: 'dicoding',
          date: '2021',
          content: 'comment A',
        }),
        new DetailedComment({
          id: 'comment-def',
          username: 'john',
          date: '31-12-2020',
          content: '**komentar telah dihapus**',
        }),
      ];

      const expectedDetailedThread = new DetailedThread({
        id: 'thread-abc4',
        title: 'title',
        body: 'body',
        date: '31-12-2020',
        username: 'John Doe',
        comments: expectedThreadComments,
      });

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.getThreadbyId = jest.fn()
        .mockImplementation(() => Promise.resolve(thread));

      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(threadComments));
      const getThreadDetailUseCase = new GetThreadDetailsUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // action
      const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

      // assert
      expect(useCaseResult).toEqual(expectedDetailedThread);
      expect(mockThreadRepository.getThreadbyId).toBeCalledWith(useCaseParam.threadId);
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    });
  });
  describe('CommentUtil', () => {
    it('should return Detailed Comment correctly', async () => {
      // arrange
      const availableComment = {
        id: 'comment-abc',
        username: 'dicoding',
        date: '2021',
        content: 'comment A',
        is_delete: false,
      };
      const deletedComment = {
        id: 'comment-def',
        username: 'john',
        date: '31-12-2020',
        content: 'comment B',
        is_delete: true,
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      const getThreadDetailUseCase = new GetThreadDetailsUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });
      // action
      const availableCommentDetail = await getThreadDetailUseCase._filterDeletedComments(availableComment);
      const deletedCommentDetail = await getThreadDetailUseCase._filterDeletedComments(deletedComment);
      // assert
      expect(availableCommentDetail).toEqual(new DetailedComment({
        id: 'comment-abc',
        username: 'dicoding',
        date: '2021',
        content: 'comment A',
      }));
      expect(deletedCommentDetail).toEqual(new DetailedComment({
        id: 'comment-def',
        username: 'john',
        date: '31-12-2020',
        content: '**komentar telah dihapus**',
      }));
    });
  });
});
