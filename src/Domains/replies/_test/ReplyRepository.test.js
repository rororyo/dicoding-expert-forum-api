const ReplyRepository = require("../ReplyRepository");

describe('a ReplyRepository interface', () => { 
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.postReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.getReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.verifyReplyAvailability('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.getRepliesByCommentId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.verifyReplyOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    // Action and Assert
    await expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
 })