const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const pool = require("../../database/postgres/pool");
const LikeTableTestHelper = require("../../../../tests/LikeTableTestHelper");

describe("/threads/{threadId}/comments endpoint", () => {
  let server;
  let accessToken;
  let threadId;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  const commentPayload = {
    content: 'sebuah comment',
  };

  const threadPayload = {
    title: 'dicoding123',
    body: 'dicoding123 gacor gacor gacor',
  };

  const registerAndLoginUser = async () => {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "password123",
        fullname: "Dicoding Indonesia",
      },
    });
    const authResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: "dicoding", password: "password123" },
    });
    accessToken = JSON.parse(authResponse.payload).data.accessToken;
    return accessToken;
  };

  const createThread = async () => {
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: threadPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    threadId = JSON.parse(response.payload).data.addedThread.id;
    return threadId;
  };
  
  describe('when PUT /threads/{threadId}/comments/{commentId}', () => { 
    it("should return 401 if not authenticated", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "dicoding",
        body: "dicoding.com",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        content: "dicoding.com",
      });
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        payload: {},
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(401);
      expect(JSON.parse(payload).error).toEqual("Unauthorized");
    });

    it('should return 404 if thread not found', async () => {
      await registerAndLoginUser();
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 404 when comment not found', async () => {
      const token = await registerAndLoginUser();
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await server.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments/comment-1234/replies`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toBe(404);
      const responseBody = JSON.parse(response.payload);
      expect(responseBody.message).toBe('komentar tidak ditemukan');
    });

    it('should like comment if comment is not liked yet', async () => {
      const token = await registerAndLoginUser();
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      await server.inject({
        method: "PUT",
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/likes`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const result = await LikeTableTestHelper.findLikeByCommentId(comment.result.data.addedComment.id);
      expect(result).toHaveLength(1);
    });

    it('should unlike comment if comment is already liked', async () => {
      const token = await registerAndLoginUser();
      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${thread.result.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      await server.inject({
        method: "PUT",
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/likes`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      await server.inject({
        method: "PUT",
        url: `/threads/${thread.result.data.addedThread.id}/comments/${comment.result.data.addedComment.id}/likes`,
        payload: {},
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const result = await LikeTableTestHelper.findLikeByCommentId(comment.result.data.addedComment.id);
      expect(result).toHaveLength(0);
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should return 401 if not authenticated", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "dicoding",
        body: "dicoding.com",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        content: "dicoding.com",
      });
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",
        payload: {},
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(401);
      expect(JSON.parse(payload).error).toEqual("Unauthorized");
    });

    it('should return 403 if comment owner is not the same as user', async () => {
      await registerAndLoginUser();
      await createThread();
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: threadId,
        owner: "bukanuser-123",
        content: "dicoding.com",
      });
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/comment-123`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode } = response;
      expect(statusCode).toEqual(403);
    });

    it('should return 200 and delete comment', async () => {
      await registerAndLoginUser();
      await createThread();
      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "dicoding.com" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const commentId = JSON.parse(comment.payload).data.addedComment.id;
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(200);
      expect(JSON.parse(payload).status).toEqual("success");
    });
  });
});