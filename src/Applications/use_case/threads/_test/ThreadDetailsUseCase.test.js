const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
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
          replies: [
            {
              id: "reply-123",
              username: "user-123",
              date: "2024-08-01T00:00:00.000Z",
              content: "dicoding123",
            },
          ],
        },
      ],
    };

    // Mock data for repositories without using expected value directly
    const threadData = {
      id: "thread-123",
      title: "dicoding123",
      body: "dicoding123 gacor gacor gacor",
      date: "2024-08-01T00:00:00.000Z",
      username: "user-123",
    };

    const commentData = [
      {
        id: "comment-123",
        username: "user-123",
        date: "2024-08-01T00:00:00.000Z",
        content: "dicoding123",
        is_delete: 0,
      },
    ];

    const replyData = [
      {
        id: "reply-123",
        content: "dicoding123",
        username: "user-123",
        date: "2024-08-01T00:00:00.000Z",
        is_delete: 0,
      },
    ];

    // Mock Repository
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock ThreadRepository
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadData));

    // Mock CommentRepository
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => 
      Promise.resolve(
        commentData.map(comment => ({
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
        }))
      )
    );

    // Mock ReplyRepository
    mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve(replyData));

    // Create use case instance
    const threadDetailsUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetails = await threadDetailsUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentData[0].id);
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
  });
});
