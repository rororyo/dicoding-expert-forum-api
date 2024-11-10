const AddReplyUseCase = require("../../../../Applications/use_case/replies/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/replies/DeleteReplyUseCase");

class ReplyHandler{
  constructor(container){
    this._container = container
    this.postReplyHandler = this.postReplyHandler.bind(this)
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
  }
  async postReplyHandler(request, h){
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const {id: ownerId} = request.auth.credentials
    const {threadId, commentId} = request.params
    const reply = await addReplyUseCase.execute({
      content: request.payload.content,
    },threadId,commentId,ownerId)
    return h.response({
      status: 'success',
      data:{
        addedReply: reply
      }
    }).code(201)
  }
  async deleteReplyHandler(request, h){
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const {id: ownerId} = request.auth.credentials
    const {threadId, commentId, commentReplyId} = request.params
    await deleteReplyUseCase.execute(commentReplyId,threadId,commentId,ownerId)
    return h.response({
      status: 'success'
    })
  }
}

module.exports = ReplyHandler