const ReplyDetails = require("../ReplyDetails");

describe('a ReplyDetails entity ', () => { 
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new ReplyDetails(payload)).toThrowError(
      "REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 123,
      date: '11/11/2022',
      username: 'dicoding',
    };
    expect(() => new ReplyDetails(payload)).toThrowError(
      "REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it('should create ReplyDetails object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini adalah reply',
      date: '11/11/2022',
      username: 'dicoding',
    }
    expect(new ReplyDetails(payload)).toEqual({
      id: 'reply-123',
      content: 'ini adalah reply',
      date: '11/11/2022',
      username: 'dicoding',
    });
  })
 })