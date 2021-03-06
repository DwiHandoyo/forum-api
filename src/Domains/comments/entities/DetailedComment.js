class DetailedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      username,
      date,
      is_delete,
    } = payload;

    this.id = id;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.username = username;
    this.date = date;
  }

  _verifyPayload({
    id, content, username, date,
  }) {
    if (!id || !content || !username || !date) {
      throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string') {
      throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailedComment;
