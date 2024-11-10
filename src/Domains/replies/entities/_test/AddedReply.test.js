const AddedReply = require("../AddedReply");

describe('a AddedReply entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini adalah reply',
      owner: 'user-123',
    }
    expect(new AddedReply(payload)).toEqual({
      id: 'reply-123',
      content: 'ini adalah reply',
      owner: 'user-123',
    });
  })

 })