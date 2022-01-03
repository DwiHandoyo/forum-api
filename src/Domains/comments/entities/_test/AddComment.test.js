const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'thread-abc',
      threadId: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_CONTENT');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      content: true,
      threadId: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      owner: 'user-blabla',
      content: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicodingDicoding Indonesia',
      threadId: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.CONTENT_LIMIT_CHAR');
  });


  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      owner: 'dicoding',
      content: 'Dicoding Indonesia',
      threadId: 'thread-abc',
    };

    // Action
    const { owner, content, threadId } = new AddComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
  });
});
