const DetailedThread = require('../DetailedThread');

describe('a DetailedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'dicoding',
      title: 'Dicoding',
      body: 'Dicoding Indonesia Juara',
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      title: 'Dicoding',
      body: {},
      date: '12-12-2021',
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'dicoding',
      title: 'Dicoding',
      body: 'Dicoding Indonesia Juara',
      date: '12-12-2021',
      comments: [],
    };

    // Action
    const detailedThread = new DetailedThread(payload);

    // Assert
    expect(detailedThread.id).toEqual(payload.id);
    expect(detailedThread.username).toEqual(payload.username);
    expect(detailedThread.body).toEqual(payload.body);
    expect(detailedThread.title).toEqual(payload.title);
    expect(detailedThread.date).toEqual(payload.date);
    expect(detailedThread.comment).toEqual(payload.comment);
  });
});
