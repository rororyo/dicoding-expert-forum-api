const LikeTableTestHelper = require("../../../../../tests/LikeTableTestHelper");
const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const LikeRepository = require("../../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const LikeActionUseCase = require("../LikeActionUseCase")

describe('LikeActionUseCase', () => {
  let mockThreadRepository;
  let mockCommentRepository;
  let mockLikeRepository;
  let likeActionUseCase;

  beforeEach(() => {
    // Mock dependencies
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();
    mockLikeRepository = new LikeRepository();

    // Create use case instance
    likeActionUseCase = new LikeActionUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    LikeTableTestHelper.cleanTable();

    jest.resetAllMocks();
  });
  afterAll(async () => {
    await LikeTableTestHelper.cleanTable();
  });

  it('should orchestrate the like action correctly', async () => {
    const useCasePayload = {
      user_id: 'user-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
    };

    // Mock implementations
    mockThreadRepository.verifyThreadAvailability = jest.fn(()=> Promise.resolve())
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeAvailability = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.likeAComment = jest.fn(() => Promise.resolve());

    // Execute use case
    await likeActionUseCase.execute(useCasePayload.thread_id,useCasePayload.comment_id, useCasePayload.user_id);

    // Assert calls
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.comment_id);
    expect(mockLikeRepository.verifyLikeAvailability).toBeCalledWith(useCasePayload.thread_id,useCasePayload.comment_id, useCasePayload.user_id);
    expect(mockLikeRepository.likeAComment).toBeCalledWith(useCasePayload.thread_id,useCasePayload.comment_id, useCasePayload.user_id);
  });

  it('should orchestrate the unlike action correctly', async () => {
    const useCasePayload = {
      user_id: 'user-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
    };

    // Mock implementations
    mockThreadRepository.verifyThreadAvailability = jest.fn(()=> Promise.resolve())
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeAvailability = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.unlikeAComment = jest.fn(() => Promise.resolve());

    // Execute use case
    await likeActionUseCase.execute(useCasePayload.thread_id,useCasePayload.comment_id, useCasePayload.user_id);

    // Assert calls
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.comment_id);
    expect(mockLikeRepository.verifyLikeAvailability).toBeCalledWith(useCasePayload.thread_id,useCasePayload.comment_id,useCasePayload.user_id);
    expect(mockLikeRepository.unlikeAComment).toBeCalledWith(useCasePayload.thread_id,useCasePayload.comment_id,useCasePayload.user_id);
  });
});
