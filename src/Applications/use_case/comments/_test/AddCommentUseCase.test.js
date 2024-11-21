const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const PostComment = require("../../../../Domains/comments/entities/PostComment");
const PostedComment = require("../../../../Domains/comments/entities/PostedComment");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrate the add comment action correctly", async () => {
    // Arrange 
    const useCaseCommentPayload = new PostComment({
      threadId: "thread-123",
      owner: "user-123",
      content: "sebuah comment",
    });

    const rawCommentData = {
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
    };

    const expectedAddedComment = new PostedComment(rawCommentData);

    // Mock Repository
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mock methods
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(new PostedComment({
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
    })));
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());

    // Create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCaseCommentPayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCaseCommentPayload.threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(useCaseCommentPayload);
  });
});
