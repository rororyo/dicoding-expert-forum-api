class ReplyRepository {
  async postReply(reply,threadId,commentId,ownerId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async getReplyById(replyId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async getRepliesByCommentId(commentId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
  async verifyReplyAvailability(replyId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async verifyReplyOwner(replyId,ownerId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async deleteReply(replyId,threadId,commentId,ownerId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
module.exports = ReplyRepository