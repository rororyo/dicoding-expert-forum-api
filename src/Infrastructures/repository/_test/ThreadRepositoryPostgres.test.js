const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
const PostThread = require("../../../Domains/threads/entities/PostThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("a ThreadRepositoryPostgres interface", () => {
  it("should be instance of ThreadRepository domain", async () => {
    // Arrange
    const threadRepositoryPostgres = new ThreadRepositoryPostgres();
    // Action and Assert
    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });
  describe("a behaviour test", () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });
    afterAll(async () => {
      await pool.end();
    });
    describe("a addThread function", () => {
      it("should persist thread and return added thread correctly", async () => {
        await UsersTableTestHelper.addUser({
          id: "user-123",
          username: "dicoding",
        });
        const newThread = new PostThread({
          title: "dicoding",
          body: "dicoding.com",
          owner: "user-123",
        });

        const fakeIdGenerator = () => "125124113asdaasawda";
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator
        );
        const postedThread = await threadRepositoryPostgres.addThread(
          newThread
        );

        const thread = await ThreadsTableTestHelper.getThreadById(
          "thread-h_125124113asdaasawda"
        );

        expect(postedThread).toStrictEqual(
          new PostedThread({
            id: "thread-h_125124113asdaasawda",
            title: "dicoding",
            body: "dicoding.com",
            owner: "user-123",
          })
        );
        expect(thread).toStrictEqual([{
          id: "thread-h_125124113asdaasawda",
          title: "dicoding",
          body: "dicoding.com",
          owner: "user-123",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }])
      });
    });
    describe("a getThreadById function", () => {
      it("should return thread details correctly", async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          () => "123"
        );
        const userPayload = {
          id: "user-123",
          username: "dicoding",
        };
        const threadPayload = {
          id: "thread-h_123",
          title: "dicoding",
          body: "dicoding.com",
          owner: "user-123",
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        // Action
        const thread = await threadRepositoryPostgres.getThreadById(
          "thread-h_123"
        );
        // Assert
        expect(thread).toStrictEqual({
          id: "thread-h_123",
          title: "dicoding",
          body: "dicoding.com",
          date: expect.any(Date),
          owner: "user-123",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      });
    });
    describe("a verifyThreadAvailability function", () => {
      it("should throw error when thread not found", async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          () => "123"
        );

        // Action and Assert
        await expect(
          threadRepositoryPostgres.verifyThreadAvailability("thread-h_123")
        ).rejects.toThrow(NotFoundError);
      });
      it("should not throw a NotFoundError when thread found", async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          () => "123"
        );
        const userPayload = {
          id: "user-123",
          username: "dicoding",
        };
        const threadPayload = {
          id: "thread-h_123",
          title: "dicoding",
          body: "dicoding.com",
          owner: "user-123",
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);

        // Action and Assert
        await expect(
          threadRepositoryPostgres.verifyThreadAvailability("thread-h_123")
        ).resolves.not.toThrow(NotFoundError);
      });
    });
  });
});
