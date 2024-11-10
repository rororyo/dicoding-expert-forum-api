const PostedComment = require('../PostedComment');
describe('a PostedComment entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      date: '2022-01-01T00:00:00.000Z',
      owner: 'user-123',
    }
    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: true,
      owner: 123,
    }
    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content : 'sebuah comment',
      owner : 'user-123',
    }
    // Action
    const postedComment = new PostedComment(payload);
    // Assert
    expect(postedComment.id).toEqual(payload.id);
    expect(postedComment.owner).toEqual(payload.owner);
    expect(postedComment.content).toEqual(payload.content);
  })
 })