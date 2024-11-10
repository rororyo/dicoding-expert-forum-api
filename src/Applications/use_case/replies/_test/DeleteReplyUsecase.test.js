const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const ReplyDetails = require("../../../../Domains/replies/entities/ReplyDetails")
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository")
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository")
const DeleteReplyUseCase = require("../DeleteReplyUseCase")

describe('a DeleteReplyUseCase', () => { 
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCaseReplyPayload = {
      content: 'sebuah reply'
    }
    const useCaseUserPayload = {
      id: 'user-123'
    }
    const useCaseThreadPayload = {
      id: 'thread-123'
    }
    const useCaseCommentPayload = {
      id: 'comment-123'
    }

    const mockReplyDetails = new ReplyDetails({
      id: 'reply-123',
      content: 'sebuah reply',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
  })

    const mockDeletedReply = new ReplyDetails({
      id: 'reply-123',
      content: '**balasan telah dihapus**',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    })

    const mockReplyRepository = new ReplyRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    // Mock implementations without returning expected value directly
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue(undefined);
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue(undefined);
    mockReplyRepository.verifyReplyAvailability = jest.fn().mockResolvedValue(undefined);

    // Simulate getting a reply by ID and deleting the reply
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(() => Promise.resolve(mockReplyDetails));
    mockReplyRepository.verifyReplyOwner = jest.fn().mockResolvedValue(undefined);
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve(mockDeletedReply));

    // Action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    await deleteReplyUseCase.execute(mockReplyDetails.id, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id)

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCaseThreadPayload.id);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCaseCommentPayload.id);
    expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(mockReplyDetails.id);
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith(mockReplyDetails.id);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(mockReplyDetails.id, useCaseUserPayload.id);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(mockReplyDetails.id);
  })
})
