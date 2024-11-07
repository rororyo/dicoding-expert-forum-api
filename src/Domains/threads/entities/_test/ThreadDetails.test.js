const ThreadDetails = require("../ThreadDetails");
describe("a ThreadDetails entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};
    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      thread: {
        id: true,
        title: 123412,
        body: "dicoding123 gacor gacor gacor",
        date: "2024-08-01T00:00:00.000Z",
        username: "user-123",
        comments: [],
      },
    };
    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it("should create ThreadDetails object correctly", () => {
    const payload = {
      thread: {
        id: "thread-123",
        title: "dicoding123",
        body: "dicoding123 gacor gacor gacor",
        date: "2024-08-01T00:00:00.000Z",
        username: "user-123",
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          },
        ],
      },
    };

    // Action
    const threadDetails = new ThreadDetails(payload);
    // Assert
    const { id, title, body, date, username, comments } = threadDetails.thread;
    expect(id).toEqual(payload.thread.id);
    expect(title).toEqual(payload.thread.title);
    expect(body).toEqual(payload.thread.body);
    expect(date).toEqual(payload.thread.date);
    expect(username).toEqual(payload.thread.username);
  });
});
