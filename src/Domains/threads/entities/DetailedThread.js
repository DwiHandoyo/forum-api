class DetailedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, username, date, comments: comment,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.username = username;
    this.date = date;
    this.comments = comment;
  }

  _verifyPayload({
    id, title, body, username, date, comments,
  }) {
    if (!id || !title || !body || !username || !date || !comments) {
      throw new Error('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || !(Array.isArray(comments))) {
      throw new Error('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailedThread;
