const PostedThread = require("../PostedThread");

describe("a PostedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "dicoding",
      body: "dicoding123",
    };

  // Action and Assert
  expect(() => new PostedThread(payload)).toThrowError(
    "POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
  );
  });
  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      title: "dicoding123",
      owner: "1234",
    };
    // Action and Assert
    expect(()=> new PostedThread(payload)).toThrowError(
      "POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
  });
  it("should create PostedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      owner: "user-123",
    };
    // Action
    const { id, title, owner } = new PostedThread(payload);
    // Assert
    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(owner).toBe(payload.owner);
  });
});
