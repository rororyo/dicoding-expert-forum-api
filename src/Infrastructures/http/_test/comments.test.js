const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const pool = require("../../database/postgres/pool");

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
  });

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
  };

  const createThread = async () => {
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: { title: "dicoding", body: "Dicoding Indonesia" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    threadId = JSON.parse(response.payload).data.addedThread.id;
  };

  describe("when POST /threads/{threadId}/comments", () => {
    it("should return 401 if not authenticated", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "dicoding",
        body: "dicoding.com",
      });
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: {},
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(401);
      expect(JSON.parse(payload).error).toEqual("Unauthorized");
    });

    it("should return 400 if request payload lacks required properties", async () => {
      await registerAndLoginUser();
      await createThread();
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(400);
      expect(JSON.parse(payload).status).toEqual("fail");
      expect(JSON.parse(payload).message).toEqual(
        "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should return 400 if request payload has incorrect data type", async () => {
      await registerAndLoginUser();
      await createThread();
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: 123 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(400);
      expect(JSON.parse(payload).status).toEqual("fail");
      expect(JSON.parse(payload).message).toEqual("tipe data tidak sesuai");
    });

    it("should return 201 and persist comment", async () => {
      await registerAndLoginUser();
      await createThread();
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "dicoding.com" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode, payload } = response;
      const resJson = JSON.parse(payload);
      const persistedComment = await CommentsTableTestHelper.getCommentById(
        JSON.parse(payload).data.addedComment.id
      )
      expect(statusCode).toEqual(201);
      expect(resJson.status).toEqual("success");
      expect(resJson.data.addedComment.id).toBeDefined();
      expect(resJson.data.addedComment.content).toEqual("dicoding.com");
      expect(resJson.data.addedComment.owner).toBeDefined();

      expect(persistedComment[0].id).toEqual(JSON.parse(payload).data.addedComment.id);
      expect(persistedComment[0].thread_id).toEqual(threadId);
      expect(persistedComment[0].content).toEqual(resJson.data.addedComment.content);
      expect(persistedComment[0].owner_id).toEqual(resJson.data.addedComment.owner);
      expect(persistedComment[0].created_at).toBeDefined();
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
      })
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
      })
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/comment-123`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { statusCode, payload } = response;
      expect(statusCode).toEqual(403);
    })
    it('should return 200 and delete comment', async () => {
      await registerAndLoginUser();
      await createThread();
      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: { content: "dicoding.com" },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
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
    })
  });
});
