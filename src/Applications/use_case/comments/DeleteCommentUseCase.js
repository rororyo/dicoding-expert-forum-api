class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(useCasePayload) {
    const { commentId, threadId, owner} = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(threadId); 
    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    return await this._commentRepository.deleteComment(commentId, threadId, owner);
  }
}
module.exports = DeleteCommentUseCase