const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const { threadId } = addComment;

    await this._threadRepository.checkAvailabilityThread(threadId);
    const data = await this._commentRepository.addComment(addComment);
    return new AddedComment(data);
  }
}

module.exports = AddCommentUseCase;
