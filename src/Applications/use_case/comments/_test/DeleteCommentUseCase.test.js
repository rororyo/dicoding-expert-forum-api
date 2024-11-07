const CommentRepository = require("../../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository")
const DeleteCommentUseCase = require("../DeleteCommentUseCase")

describe('a Delete Comment Use Case', () => { 
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }
    // Mock Repository
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    //Mock functions
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve(
      {
        id: "comment-yksuCoxM2s4MMrZJO-qVD",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "Sebuah komentar yang belum di hapus",
      }
    ))
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve({
      id: "comment-yksuCoxM2s4MMrZJO-qVD",
      username: "dicoding",
      date: "2021-08-08T07:26:21.338Z",
      content: "**komentar telah dihapus**"
    }))

    // Action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })
    const deletedComment = await deleteCommentUseCase.execute(useCasePayload)
    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId,useCasePayload.owner)
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId,useCasePayload.threadId,useCasePayload.owner)
    
    expect(deletedComment)
      .toEqual({
        id: "comment-yksuCoxM2s4MMrZJO-qVD",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "**komentar telah dihapus**"
      })
  })
 })
