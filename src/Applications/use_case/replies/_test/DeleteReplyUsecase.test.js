const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository")
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository")
const DeleteReplyUseCase = require("../DeleteReplyUseCase")

describe('a DeleteReplyUseCase', () => { 
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCaseUserPayload = {
      id: 'user-123'
    }
    const useCaseThreadPayload = {
      id: 'thread-123'
    }
    const useCaseCommentPayload = {
      id: 'comment-123'
    }
    const useCaseReplyPayload = {
      id:'reply-123'
    }
    const mockReplyRepository = new ReplyRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    // Mock implementations without returning expected value directly
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    // Action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    await deleteReplyUseCase.execute(useCaseReplyPayload.id, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id)

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCaseThreadPayload.id);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCaseCommentPayload.id);
    expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(useCaseReplyPayload.id);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCaseReplyPayload.id, useCaseUserPayload.id);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCaseReplyPayload.id);
  })
})
