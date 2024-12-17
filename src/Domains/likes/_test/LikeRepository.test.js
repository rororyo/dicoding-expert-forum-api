const LikeRepository = require("../LikeRepository");


describe('LikeRepository interface', () => { 
  it('should throw error when invoke abstract method', async () => {
    // arrange
    const likeRepository= new LikeRepository()
    // action and assert
    await expect(likeRepository.verifyLikeAvailability('','','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.likeAComment('','','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.unlikeAComment('','','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
 })