const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    const accessToken = await this._authenticationTokenManager.extractToken(useCasePayload.auth);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const addComment = new AddComment(useCasePayload);
    const {threadId} = addComment;

    await this._threadRepository.checkAvailabilityThread(threadId);
    const data = await this._commentRepository.addComment(addComment);
    return data;
  }
}

module.exports = AddCommentUseCase;
