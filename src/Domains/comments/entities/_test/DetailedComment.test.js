const DetailedComment = require('../DetailedComment');

describe('a DetailedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-xyz',
      username: 'dicoding',
      content: 'Dicoding Indonesia Juara',
    };

    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      content: {},
      date: '12-12-2021',
    };

    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'Dicoding Indonesia Juara',
      date: '12-12-2021',
    };

    // Action
    const detailedComment = new DetailedComment(payload);

    // Assert
    expect(detailedComment.id).toEqual(payload.id);
    expect(detailedComment.username).toEqual(payload.username);
    expect(detailedComment.content).toEqual(payload.content);
    expect(detailedComment.date).toEqual(payload.date);
  });
});
