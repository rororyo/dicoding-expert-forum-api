class LikeActionUseCase{
  constructor({threadRepository,commentRepository,likeRepository}){
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._likeRepository = likeRepository
  }
  async execute(threadId,commentId,userId){
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._commentRepository.verifyCommentAvailability(commentId)
    if(await this._likeRepository.verifyLikeAvailability(threadId,commentId,userId)){
      await this._likeRepository.unlikeAComment(threadId,commentId,userId)
    }
    else{
      await this._likeRepository.likeAComment(threadId,commentId,userId)
    }

  }
}
module.exports = LikeActionUseCase