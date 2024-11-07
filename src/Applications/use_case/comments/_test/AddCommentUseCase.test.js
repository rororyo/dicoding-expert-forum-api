const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const PostComment = require("../../../../Domains/comments/entities/PostComment")
const PostedComment = require("../../../../Domains/comments/entities/PostedComment")
const AddCommentUseCase = require("../AddCommentUseCase")

describe('AddCommentUseCase', () => { 
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange 
    const useCaseCommentPayload = new PostComment( {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'sebuah comment',
    })
    const mockAddedComment = new PostedComment ({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    })
    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(mockAddedComment);
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository
    })
    // Action
    const addedComment = await addCommentUseCase.execute(useCaseCommentPayload);
    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(useCaseCommentPayload);
  })
 })