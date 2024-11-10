const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      date: '2022-01-01T00:00:00.000Z',
    }
    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 123,
      owner: 'user-123',
    }
    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it ('should create postComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      threadId: 'thread-123',
      owner: 'user-123',
    }
    // Action
    const postComment = new PostComment(payload);
    // Assert
    expect(postComment.threadId).toEqual(payload.threadId);
    expect(postComment.content).toEqual(payload.content);
    expect(postComment.owner).toEqual(payload.owner);
  })
})