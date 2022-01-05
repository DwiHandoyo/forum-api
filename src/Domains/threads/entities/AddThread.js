class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body }) {
    if (!title) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_TITLE');
    }

    if (!body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_BODY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 100) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = AddThread;
