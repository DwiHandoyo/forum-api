const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-abhbabg',
      body: 'dicoding emang mantap',
      title: 'dicoding',
      auth: 'Bearer xyz'
    };
    const accessToken = 'xyz';
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      owner: useCasePayload.owner,
      title: useCasePayload.title,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));
    mockAuthenticationTokenManager.extractToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: useCasePayload.owner,
      body: useCasePayload.body,
      title: useCasePayload.title,
    }));
  });
});
