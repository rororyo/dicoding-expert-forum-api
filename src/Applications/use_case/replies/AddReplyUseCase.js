const AddReply = require("../../../Domains/replies/entities/AddReply")

class AddReplyUseCase{
  constructor({replyRepository, threadRepository, commentRepository}){
    this._replyRepository = replyRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }
  async execute(useCaseReplyPayload,useCaseThreadPayload,useCaseCommentPayload,useCaseUserPayload){
    const content = new AddReply(useCaseReplyPayload)
    await this._threadRepository.verifyThreadAvailability(useCaseThreadPayload)
    await this._commentRepository.verifyCommentAvailability(useCaseCommentPayload)
    return this._replyRepository.postReply(content, useCaseThreadPayload, useCaseCommentPayload, useCaseUserPayload)
  }
}
module.exports = AddReplyUseCase