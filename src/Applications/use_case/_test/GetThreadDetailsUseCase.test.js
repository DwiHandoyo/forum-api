const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread');
const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-abc',
    };

    const expectedDetailedThread = new DetailedThread({
      id: 'thread-abc4',
      title: 'title',
      body: 'body',
      date: '31-12-2020',
      username: 'John Doe',
      comments: [],
    });

    const threadComments = [
      new DetailedComment({
        id: 'comment-abc',
        username: 'dicoding',
        date: '2021',
        content: 'comment A',
        is_delete: false,
      }),
      new DetailedComment({
        id: 'comment-def',
        username: 'john',
        date: '31-12-2020',
        content: 'comment B',
        is_delete: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    
    mockThreadRepository.getThreadbyId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailedThread));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadComments));

    const getThreadDetailUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    // assert
    expect(useCaseResult).toEqual(new DetailedThread({
      ...expectedDetailedThread, comments: threadComments,
    }));
    expect(mockThreadRepository.getThreadbyId).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
