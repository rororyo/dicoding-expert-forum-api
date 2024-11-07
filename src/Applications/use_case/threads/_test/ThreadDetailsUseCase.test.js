const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const ThreadDetailsUseCase = require("../ThreadDetailsUseCase");

describe("Thread Details UseCase", () => {
  it("should orchestrate the get thread by id action correctly", async () => {
    // Arrange
    const useCasePayload = {
      id: "thread-123",
    };

    const expectedThreadDetails = {
        id: "thread-123",
        title: "dicoding123",
        body: "dicoding123 gacor gacor gacor",
        date: "2024-08-01T00:00:00.000Z",
        username: "user-123",
        comments: [
          {
            id: "comment-123",
            username: "user-123",
            date: "2024-08-01T00:00:00.000Z",
            content: "dicoding123",
          },
        ],
    };

    // Mock Repository
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock functions
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({
        id: "thread-123",
        title: "dicoding123",
        body: "dicoding123 gacor gacor gacor",
        date: "2024-08-01T00:00:00.000Z",
        username: "user-123",
      })
    );

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: "user-123",
          date: "2024-08-01T00:00:00.000Z",
          content: "dicoding123",
          is_deleted: 0,
        },
      ])
    );

    // Create use case instance
    const threadDetailsUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetails = await threadDetailsUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
  });
});
