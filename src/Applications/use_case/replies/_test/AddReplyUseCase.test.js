const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const AddedReply = require("../../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../../Domains/replies/entities/AddReply");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCaseReplyPayload = new AddReply({
      content: 'sebuah reply'
    });
    const useCaseUserPayload = {
      id: 'user-123'
    };
    const useCaseThreadPayload = {
      id: 'thread-123'
    };
    const useCaseCommentPayload = {
      id: 'comment-123'
    };

    // Instansiasi AddedReply tanpa langsung digunakan sebagai nilai kembalian
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah reply',
      owner: useCaseUserPayload.id
    });

    // Mock repository dan fungsinya
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Implementasi mock tanpa mengembalikan nilai expected secara langsung
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue(undefined);
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue(undefined);

    // Menggunakan fungsi mock dengan behavior serupa penambahan reply
    mockReplyRepository.postReply = jest.fn().mockImplementation((replyPayload, threadId, commentId, userId) => {
      return Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: replyPayload.content,
        owner: userId
      }));
    });

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCaseReplyPayload, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id);

    // Assert
    expect(addedReply).toStrictEqual(mockAddedReply);
    expect(mockReplyRepository.postReply).toHaveBeenCalledWith(useCaseReplyPayload, useCaseThreadPayload.id, useCaseCommentPayload.id, useCaseUserPayload.id);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCaseCommentPayload.id);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCaseThreadPayload.id);
  });
});
