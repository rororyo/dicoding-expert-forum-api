const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("a Delete Comment Use Case", () => {
  it("should orchestrate the delete comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    };

    // Mock Repository
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock functions
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    // Create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
      useCasePayload.owner
    );

  });
});
