
const AddReply = require("../AddReply");

describe("a AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {};
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
    };
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it('should create AddReply object correctly', () => {
    const payload ={
      content: 'ini adalah reply',
    }
    expect(new AddReply(payload)).toEqual({
      content: 'ini adalah reply',
    });
  })

});
