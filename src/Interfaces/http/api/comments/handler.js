const AddCommentUseCase = require("../../../../Applications/use_case/comments/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/comments/DeleteCommentUseCase");

class CommentHandler{
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }
  async postCommentHandler(request,h){
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const {id:owner} = request.auth.credentials;
    const threadId = request.params.threadId;
    const useCasePayload = {
      content:request.payload.content,
      threadId,
      owner
    } 
    const comment = await addCommentUseCase.execute(useCasePayload);
    return h.response({
      status:"success",
      data:{
        addedComment:comment
      }
    }).code(201);
  }
  async deleteCommentHandler(request,h){
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const {id:owner} = request.auth.credentials;
    const threadId = request.params.threadId;
    const commentId = request.params.commentId;
    const useCasePayload = {
      commentId,
      threadId,
      owner
    }
    await deleteCommentUseCase.execute(useCasePayload);
    return h.response({
      status:"success"
    }).code(200);
  }
}

module.exports = CommentHandler