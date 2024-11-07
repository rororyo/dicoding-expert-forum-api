const PostComment = require("../../../Domains/comments/entities/PostComment");

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository
  }
  async execute(useCaseCommentPayload) {
    const comment = new PostComment(useCaseCommentPayload);
    return this._commentRepository.addComment(comment);
  }
}
module.exports = AddCommentUseCase