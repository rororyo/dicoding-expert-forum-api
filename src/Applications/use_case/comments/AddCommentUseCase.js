const PostComment = require("../../../Domains/comments/entities/PostComment");

class AddCommentUseCase {
  constructor({ commentRepository , threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository  = threadRepository
  }
  async execute(useCaseCommentPayload) {
    const comment = new PostComment(useCaseCommentPayload);
    await this._threadRepository.verifyThreadAvailability(comment.threadId);
    return this._commentRepository.addComment(comment);
  }
}
module.exports = AddCommentUseCase