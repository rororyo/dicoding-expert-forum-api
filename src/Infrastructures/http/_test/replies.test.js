const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const ReplyRepositoryPostgres = require("../../repository/ReplyRepositoryPostgres");

describe('a /threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  const commentPayload = {
    content: 'sebuah comment',
  };
  const threadPayload = {
    title: 'dicoding123',
    body: 'dicoding123 gacor gacor gacor',
  };
  const userPayload = {
    username: 'dicoding',
    password: 'dicoding123',
    fullname: 'Dicoding Indonesia',
  };

  let serverInstance;

  beforeAll(async () => {
    serverInstance = await createServer(container);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const registerAndLoginUser = async () => {
    // Register user
    await serverInstance.inject({
      method: "POST",
      url: "/users",
      payload: userPayload,
    });

    // Get access token
    const authResponse = await serverInstance.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: userPayload.username, password: userPayload.password },
    });

    const accessToken = JSON.parse(authResponse.payload).data.accessToken;
    return accessToken;
  };

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should return 404 when thread not found', async () => {
      // Arrange
      const token = await registerAndLoginUser();

      // Action
      const response = await serverInstance.inject({
        method: "POST",
        url: "/threads/thread-1234/comments/comment-123/replies",
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(404); 
      const responseBody = JSON.parse(response.payload);
      expect(responseBody.message).toBe('thread tidak ditemukan');
    });
    it('should return 404 when comment not found', async () => {
      // Arrange
      const token = await registerAndLoginUser();
      const thread = await serverInstance.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Action
      const response = await serverInstance.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments/comment-1234/replies`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      // Assert
      expect(response.statusCode).toBe(404);
      const responseBody = JSON.parse(response.payload);
      expect(responseBody.message).toBe('komentar tidak ditemukan');
    })
    it('should return 201 and persisted reply', async () => {
      const token = await registerAndLoginUser();
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload)

      const thread = await serverInstance.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const comment = await serverInstance.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      const response = await serverInstance.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const responseBody = JSON.parse(response.payload);

      expect(response.statusCode).toBe(201);
      expect(responseBody.status).toBe('success');
      expect(responseBody.data.addedReply).toBeDefined();
      expect(responseBody.data.addedReply.id).toBeDefined();
      expect(responseBody.data.addedReply.content).toBe(commentPayload.content);
    })
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => { 
    it('should return 404 when thread not found', async () => {
      // Arrange
      const token = await registerAndLoginUser();

      // Action
      const response = await serverInstance.inject({
        method: "POST",
        url: "/threads/thread-1234/comments/comment-123/replies",
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(404); 
      const responseBody = JSON.parse(response.payload);
      expect(responseBody.message).toBe('thread tidak ditemukan');
  });
    it('should return 404 when comment not found', async () => {
      // Arrange
      const token = await registerAndLoginUser();
      const thread = await serverInstance.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Action
      const response = await serverInstance.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments/comment-1234/replies`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      // Assert
      expect(response.statusCode).toBe(404);
      const responseBody = JSON.parse(response.payload);
      expect(responseBody.message).toBe('komentar tidak ditemukan');
    })
    it('should return 404 when reply not found', async () => {
      const token = await registerAndLoginUser();
      const thread = await serverInstance.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    const comment = await serverInstance.inject({
      method: "POST",
      url: `/threads/${thread.result.data.addedThread.id}/comments`,
      payload: commentPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    const response = await serverInstance.inject({
      method:"DELETE",
      url:`/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies/reply-1234`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    expect(response.statusCode).toBe(404);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody.message).toBe('balasan tidak ditemukan');
    })
   })
   it('should return 403 when user not authorized', async () => {
    const token = await registerAndLoginUser();
    const thread = await serverInstance.inject({
      method: "POST",
      url: "/threads",
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  const comment = await serverInstance.inject({
    method: "POST",
    url: `/threads/${thread.result.data.addedThread.id}/comments`,
    payload: commentPayload,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  await UsersTableTestHelper.addUser({
    id: 'user-123',
    username:'rororyo'
  })
  await RepliesTableTestHelper.addReply({
    id: 'reply-123',
    threadId: thread.result.data.addedThread.id,
    commentId: comment.result.data.addedComment.id,
    content: 'sebuah reply yang tidak bisa dihapus oleh user lain',
    ownerId: 'user-123'
  })
  // Action
  const response = await serverInstance.inject({
    method:"DELETE",
    url:`/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies/reply-123`,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  // Assert
  expect(response.statusCode).toBe(403);
  const responseBody = JSON.parse(response.payload);
  expect(responseBody.message).toBe('Anda tidak berhak melakukan aksi ini');
   })
   it('should delete reply correctly', async () => {
    const token = await registerAndLoginUser();
    const thread = await serverInstance.inject({
      method: "POST",
      url: "/threads",
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  const comment = await serverInstance.inject({
    method: "POST",
    url: `/threads/${thread.result.data.addedThread.id}/comments`,
    payload: commentPayload,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const reply = await serverInstance.inject({
    method: "POST",
    url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies`,
    payload: {content: 'sebuah reply'},
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const deleteReply = await serverInstance.inject({
    method:"DELETE",
    url:`/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,{});
  const deletedReplyDetails = await replyRepositoryPostgres.getReplyById(reply.result.data.addedReply.id);
  expect(deletedReplyDetails.content).toBe('**balasan telah dihapus**');
  expect(deleteReply.statusCode).toBe(200);
  const responseBody = JSON.parse(deleteReply.payload);
  expect(responseBody.status).toBe('success');
  
   })
});
