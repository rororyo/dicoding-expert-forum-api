const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const PostComment = require("../../../Domains/comments/entities/PostComment");
const PostedComment = require("../../../Domains/comments/entities/PostedComment");
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
      };
      const newComment = new PostComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => "123");
  
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);
      const persistedComment = await commentRepositoryPostgres.getCommentById('comment-_pby_123');
  
      // Assert
      expect(addedComment).toStrictEqual(new PostedComment({
        id: 'comment-_pby_123',
        content: newComment.content,
        owner: newComment.owner,
      }));
      expect(persistedComment).toStrictEqual([{
        id: 'comment-_pby_123',
        content: newComment.content,
        owner: newComment.owner,
        date: expect.any(Date),
        is_delete: 0
      }])
    });
  });
  
  describe('a getCommentById function', () => { 
    it('should get comment correctly', async () => {
      // Arrange
      const commentPayload = {
        threadId: threadId,
        owner: userId,
        content: "dicoding456",
      };
      const newComment = new PostComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => "456");
  
      // Action
      await commentRepositoryPostgres.addComment(newComment);
      const comment = await commentRepositoryPostgres.getCommentById('comment-_pby_456');
      // Assert
      expect(comment).toStrictEqual([{
        id: 'comment-_pby_456',
        content: newComment.content,
        owner: newComment.owner,
        date: expect.any(Date),
        is_delete: 0
      }]);
    });
  });
  
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
      // Assert
      expect(comments).toStrictEqual([{
        id: 'comment-_pby_1122',
        content: newComment.content,
        owner_id: newComment.owner,
        date: expect.any(Date),
        is_delete: 0
      }])
      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual('comment-_pby_1122');
      expect(comments[0].thread_id).toEqual('thread-h_1122');
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].owner_id).toEqual('user-456');
      expect(comments[0].is_delete).toEqual(0);
      expect(comments[0].created_at).toBeDefined();
      expect(comments[0].updated_at).toBeDefined();
      expect(comments[0].date).toBeDefined();
    })
   })
   describe('a verifyCommentAvailability function', () => { 
    it('should throw not found error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "456");
      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('idgakvalid')).rejects.toThrow(new NotFoundError('komentar tidak ditemukan'));
    })
    it('should not throw not found error when comment found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool,() => "45678");
      await commentRepositoryPostgres.addComment(new PostComment({
        threadId: threadId,
        owner: userId,
        content: "dicoding 1212",
      }))
      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-_pby_45678')).resolves.not.toThrow(new NotFoundError('komentar tidak ditemukan'));
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
    it('should mark deleted comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => "abc");
      await commentRepositoryPostgres.addComment(new PostComment({
        threadId: threadId,
        owner: userId,
        content: "dicoding 1212",
      }));
  
      // Action
      await commentRepositoryPostgres.deleteComment('comment-_pby_abc', threadId, userId);
      const deletedComment = await commentRepositoryPostgres.getCommentById('comment-_pby_abc');
      // Assert
      expect(deletedComment[0].id).toEqual('comment-_pby_abc');
      expect(deletedComment[0].content).toEqual('dicoding 1212');
      expect(deletedComment[0].date).toBeDefined();
      expect(deletedComment[0].owner).toEqual('user-123');
      expect(deletedComment[0].is_delete).toEqual(1);
    });
  });
  
});
