const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikeTableTestHelper = require("../../../../tests/LikeTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
describe('a LikeRepositoryPostgres interface', () => { 
  beforeAll(async () => {
    await LikeTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
  })
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  })
  afterAll(async () => {
    await LikeTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  })
  describe('a verifyLikeAvailability function', () => { 
    it('should return false when like is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      // Action
      const isLikeAvailable = await likeRepositoryPostgres.verifyLikeAvailability(threadId, commentId, userId);
      // Assert
      expect(isLikeAvailable).toBe(false);
    })
    it('should return true when like is found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      await LikeTableTestHelper.addLike({ threadId,commentId, userId });
      // Action
      const isLikeAvailable = await likeRepositoryPostgres.verifyLikeAvailability(threadId,commentId, userId);
      // Assert
      expect(isLikeAvailable).toBe(true);
    })
   })
  describe('a getLikeCountByCommentId function', () => { 
    it('should return 0 when like is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const commentId = 'comment-123';
      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);
      // Assert
      expect(likeCount).toEqual("0");
    })
    it('should return like count correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      await LikeTableTestHelper.addLike({ threadId,commentId, userId });
      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);
      // Assert
      expect(likeCount).toEqual("1");
  })
})
  describe('a likeAComment function', () => { 
    it('should persist like correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      // Action
      await likeRepositoryPostgres.likeAComment(threadId,commentId, userId);
      // Assert
      const like = await LikeTableTestHelper.findLikeById('like-123');
      expect(like).toBeDefined();
      expect(like[0].comment_id).toEqual(commentId);
      expect(like[0].user_id).toEqual(userId);
    })
  })
  describe('a unlikeAComment function', () => { 
    it('should delete like correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool,() => "123");
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      await LikeTableTestHelper.addLike({ threadId,commentId, userId });
      // Action
      await likeRepositoryPostgres.unlikeAComment(threadId,commentId, userId);
      // Assert
      const like = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);
      expect(like).toEqual("0");
    })
  })
 })