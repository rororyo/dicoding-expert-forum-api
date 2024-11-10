const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe('a ReplyRepositoryPostgres interface', () => { 
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";
  beforeAll(async () => {
    await RepliesTableTestHelper.cleanTable()
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  });
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });
  describe('a addReply function', () => { 
    it('should persist reply and return added reply correctly', async () => {
      // Arrange
      const replyPayload = {
        content: 'sebuah reply',
      }
      const newReply = new AddReply(replyPayload)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,()=>'123');
      // Action
      const postedReply = await replyRepositoryPostgres.postReply(newReply,threadId,commentId,userId);
      // Assert
      const reply = await RepliesTableTestHelper.getReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(postedReply).toStrictEqual({
        id: 'reply-123',
        content: replyPayload.content,
        owner: userId,
      });
      
    })
   })
   describe('a getReplyById function', () => { 
    it('should return reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
      await replyRepositoryPostgres.postReply({
        content: 'sebuah reply'},threadId,commentId,'user-123');
      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');
      // Assert
      expect(reply.id).toEqual('reply-123');
      expect(reply.content).toEqual('sebuah reply');
      expect(reply.username).toEqual('dicoding');
      expect(reply.date).toBeDefined();
    })
    })
    describe('a getRepliesByCommentId function', () => { 
      it('should return empty array if there is no reply', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-456'});
        // Action 
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        // Assert
        const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-456');
        expect(replies).toHaveLength(0);
      })
      it('should return replies correctly', async () => {
        // Arrange
        const firstReplyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        await firstReplyRepositoryPostgres.postReply({
          content:'sebuah reply'
        },threadId,commentId,userId);
        const secondReplyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "456");
        await secondReplyRepositoryPostgres.postReply({
          content:'sebuah reply 2'
        },threadId,commentId,userId);
        // Action
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);
        // Assert
        expect(replies).toHaveLength(2);
        expect(replies[0].id).toEqual('reply-123');
        expect(replies[0].content).toEqual('sebuah reply');
        expect(replies[0].username).toEqual('dicoding');
        expect(replies[0].date).toBeDefined();
        expect(replies[1].id).toEqual('reply-456');
        expect(replies[1].content).toEqual('sebuah reply 2');
        expect(replies[1].username).toEqual('dicoding');
        expect(replies[1].date).toBeDefined();
      })
     })
     describe('a verifyReplyAvailability function', () => { 
      it('should throw NotFoundError if reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "456");
        // Action and Assert
        await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-xxx')).rejects.toThrow(NotFoundError);
      })
      it('should not throw NotFoundError if reply found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        await replyRepositoryPostgres.postReply({
          content:'sebuah reply'
        },threadId,commentId,userId);
        // Action and Assert
        await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123')).resolves.not.toThrow(NotFoundError);
      })
      })
     describe('a verifyReplyOwner function', () => { 
      it('should throw AuthorizationError if reply not owned by user', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        await replyRepositoryPostgres.postReply({
          content:'sebuah reply'
        },threadId,commentId,userId);
        // Action and Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123','user-xxx')).rejects.toThrow(AuthorizationError);
      })
      it('should not throw AuthorizationError if reply owned by user', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
        await replyRepositoryPostgres.postReply({
          content:'sebuah reply'
        },threadId,commentId,userId);
        // Action and Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123',userId)).resolves.not.toThrow(AuthorizationError);
      })
      })
      describe('a deleteReply function', () => { 
        it('should delete reply and persist reply correctly', async () => {
          // Arrange 
          const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,() => "123");
          await replyRepositoryPostgres.postReply({
            content:'sebuah reply untuk di hapus'
          },threadId,commentId,userId);
          // Action
          await replyRepositoryPostgres.deleteReply('reply-123',userId);
          // Assert
          const reply = await replyRepositoryPostgres.getReplyById('reply-123');
          expect(reply.content).toEqual('**balasan telah dihapus**');
        })
       })
})