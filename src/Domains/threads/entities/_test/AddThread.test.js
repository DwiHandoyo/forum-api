const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-vtnudn',
      body: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_TITLE');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-dsdysyncby',
      title: 'Dicoding Juara',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_BODY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      title: true,
      body: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      owner: 'user-bsdynu',
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesia',
      body: 'thread-abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });


  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'dicoding',
      title: 'Dicoding Indonesia',
      body: 'thread-abc',
    };

    // Action
    const { owner, title, body } = new AddThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
