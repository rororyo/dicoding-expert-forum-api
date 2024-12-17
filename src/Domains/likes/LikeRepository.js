/* eslint-disable no-unused-vars */
class LikeRepository {
  async verifyLikeAvailability(threadId,commentId,userId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async getLikeCountByCommentId(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async likeAComment(threadId,commentId,userId){
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async unlikeAComment(threadId,commentId,userId){
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
module.exports = LikeRepository