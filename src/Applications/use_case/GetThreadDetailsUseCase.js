const DetailedThread = require('../../Domains/threads/entities/DetailedThread');

class GetThreadDetailsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const data = await this._threadRepository.getThreadbyId(threadId);
    return new DetailedThread({ ...data, comments });
  }
}

module.exports = GetThreadDetailsUseCase;
