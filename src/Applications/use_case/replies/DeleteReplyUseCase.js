class DeleteReplyUseCase{
  constructor({ replyRepository, threadRepository, commentRepository }){
    this._replyRepository = replyRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }
  async execute(replyId,threadId,commentId,ownerId){
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._commentRepository.verifyCommentAvailability(commentId)
    await this._replyRepository.verifyReplyAvailability(replyId)
    await this._replyRepository.verifyReplyOwner(replyId,ownerId)
    return await this._replyRepository.deleteReply(replyId)
  }
}
module.exports = DeleteReplyUseCase