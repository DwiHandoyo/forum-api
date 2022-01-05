class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, threadId } = payload;
    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.length > 250) {
      throw new Error('ADD_COMMENT.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = AddComment;
