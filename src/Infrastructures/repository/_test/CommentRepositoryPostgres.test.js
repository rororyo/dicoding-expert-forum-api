const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const PostComment = require("../../../Domains/comments/entities/PostComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("a CommentRepositoryPostgres interface", () => {
  it('should be a instance of Comment Repository', async () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres();
    // Action and Assert
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  })
  const userId = "user-123";
  const threadId = "thread-123";
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await UsersTableTestHelper.addUser({ id: "user-456" ,username:"user456"});
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async()=>{
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  })
  describe('a addComment function', () => { 
    it('should persist comment and return added comment correctly', async () => {
      // Arrange
      const commentPayload = {
        threadId: threadId,
        owner: userId,
        content: "dicoding",
      }
      const newComment = new PostComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "123");

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await commentRepositoryPostgres.getCommentById('comment-_pby_123');
      expect(comment[0].content).toEqual(newComment.content);
    })
   })
  describe('a getCommentById function', () => { 
    it('should throw not found error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "456");
      // Action and Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-_pby_456')).rejects.toThrow(NotFoundError);
    })
    it('should get comment correctly', async () => {
      // Arrange
      const commentPayload = {
        threadId: threadId,
        owner: userId,
        content: "dicoding456",
      }
      const newComment = new PostComment(commentPayload);
      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "456");
      await commentRepositoryPostgres.addComment(newComment);
      const comment = await commentRepositoryPostgres.getCommentById('comment-_pby_456');

      // Assert
      expect(comment[0].content).toEqual(newComment.content);
    })
   })
  describe('a getCommentsByThreadId function', () => { 
    it('should get comments of a thread correctly', async () => {
      // Arrange
      const commentPayload = {
        threadId:'thread-h_1122',
        owner: 'user-456',
        content: "dicoding 1212",
      }
      const newComment = new PostComment(commentPayload);
      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "1122");
      await commentRepositoryPostgres.addComment(newComment);

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-h_1122');
      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual('comment-_pby_1122');
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].username).toEqual('user456');
      expect(comments[0].date).toBeDefined();
    })
   })
  describe('a verifyCommentOwner function', () => { 
    it('should throw AuthorizationError if comment owner is not match', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "1212");
      await commentRepositoryPostgres.addComment(new PostComment({
        threadId: threadId,
        owner: userId,
        content: "dicoding 1212",
      }))
      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-_pby_1212', 'user-456')).rejects.toThrow(AuthorizationError);
    })
    it('should not throw AuthorizationError if comment owner is match', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "123456");
      await commentRepositoryPostgres.addComment(new PostComment({
        threadId: threadId,
        owner: userId,
        content: "dicoding 1212",
      }))
      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-_pby_123456', 'user-123')).resolves.not.toThrow(AuthorizationError);
     })
   })
  describe('a deleteComment function', () => { 
    it('should delete comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "abc");
      await commentRepositoryPostgres.addComment(new PostComment({
        threadId: threadId,
        owner: userId,
        content: "dicoding 1212",
      }))
      // Action
      await commentRepositoryPostgres.deleteComment(threadId,'comment-_pby_abc',userId,);
      const deletedComment = await commentRepositoryPostgres.getCommentById('comment-_pby_abc');
      // Assert
      expect(deletedComment[0].is_delete).toEqual(1);
      expect(deletedComment[0].content).toEqual('**komentar telah dihapus**');
    })
   })
});
