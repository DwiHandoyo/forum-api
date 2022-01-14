const DetailedThread = require('../../Domains/threads/entities/DetailedThread');
const DetailedComment = require('../../Domains/comments/entities/DetailedComment');

class GetThreadDetailsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const data = await this._threadRepository.getThreadbyId(threadId);
    data.comments = comments.map(this._filterDeletedComments);
    return new DetailedThread(data);
  }

  _filterDeletedComments(comment) {
    return new DetailedComment(comment);
  }
}

module.exports = GetThreadDetailsUseCase;
