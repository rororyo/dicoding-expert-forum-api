const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const AddedReply = require("../../../../Domains/replies/entities/AddedReply")
const AddReply = require("../../../../Domains/replies/entities/AddReply")
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository")
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository")
const AddReplyUseCase = require("../AddReplyUseCase")

describe('a AddReplyUseCase', () => { 
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCaseReplyPayload = new AddReply({
      content: 'sebuah reply'
    })
    const useCaseUserPayload = {
      id: 'user-123'
    }
    const useCaseThreadPayload = {
      id: 'thread-123'
    }
    const useCaseCommentPayload = {
      id: 'comment-123'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah reply',
      owner: useCaseUserPayload.id
    })

    const mockReplyRepository = new ReplyRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    // Mock implementations without returning expected value directly
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue(undefined);
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue(undefined);

    // Simulate creating a new reply and returning it
    mockReplyRepository.postReply = jest.fn().mockImplementation(() => {
      return Promise.resolve(mockAddedReply); // Mimicking the behavior of adding a reply
    });

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })
    
    mockReplyRepository.verifyReplyAvailability = jest.fn().mockResolvedValue(undefined);

    // Action
    const addedReply = await addReplyUseCase.execute(useCaseReplyPayload, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id);

    // Assert
    expect(addedReply).toStrictEqual(mockAddedReply);
    expect(mockReplyRepository.postReply).toHaveBeenCalledWith(useCaseReplyPayload, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCaseCommentPayload.id);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCaseThreadPayload.id);
  })
})
