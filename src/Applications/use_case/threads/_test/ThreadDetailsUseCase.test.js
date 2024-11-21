const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const ThreadDetailsUseCase = require("../ThreadDetailsUseCase");

describe("Thread Details UseCase", () => {
  it("should orchestrate the get thread by id action correctly", async () => {
    // Arrange
    const useCasePayload = {
      id: "thread-123",
    };

    const expectedThreadDetails = {
      id: "thread-123",
      title: "dicoding123",
      body: "dicoding123 gacor gacor gacor",
      date: "2024-08-01T00:00:00.000Z",
      username: "Dicoding",
      comments: [
        {
          id: "comment-123",
          username: "Dicoding",
          date: "2024-08-01T00:00:00.000Z",
          content: "dicoding123",
          replies: [
            {
              id: "reply-123",
              username: "Dicoding",
              date: "2024-08-01T00:00:00.000Z",
              content: "dicoding123",
            },
          ],
        },
        {
          id: "comment-456",
          username: "Dicoding",
          date: "2024-08-01T00:00:00.000Z",
          content: "dicoding123456",
          replies: [
            {
              id: "reply-123",
              username: "Dicoding",
              date: "2024-08-01T00:00:00.000Z",
              content: "dicoding123",
            },
          ],
        },
      ],
    };

    // Mock data for repositories without using expected value directly
    const threadData = {
      id: "thread-123",
      title: "dicoding123",
      body: "dicoding123 gacor gacor gacor",
      date: "2024-08-01T00:00:00.000Z",
      owner: "user-123",
      created_at: "2024-08-01T00:00:00.000Z",
      updated_at: "2024-08-01T00:00:00.000Z",
    };

    const commentData = [
      {
        id: "comment-123",
        owner: "user-123",
        date: "2024-08-01T00:00:00.000Z",
        content: "dicoding123",
        is_delete: 0,
      },
    ];

    const replyData = [
      {
        id: "reply-123",
        content: "dicoding123",
        owner: "user-123",
        date: "2024-08-01T00:00:00.000Z",
        is_delete: 0,
      },
    ];

    // Mock Repository
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();
    
    // Mock ThreadRepository
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadData));

    // Mock CommentRepository
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => 
      Promise.resolve(
        [{
          id: "comment-123",
          thread_id: "thread-123",
          content: "dicoding123",
          owner_id: "user-123",
          created_at: "2024-08-01T00:00:00.000Z",
          updated_at: "2024-08-01T00:00:00.000Z",
          date: "2024-08-01T00:00:00.000Z",
          is_delete: 0
        },{
          id: "comment-456",
          thread_id: "thread-123",
          content: "dicoding123456",
          owner_id: "user-123",
          created_at: "2024-08-01T00:00:00.000Z",
          updated_at: "2024-08-01T00:00:00.000Z",
          date: "2024-08-01T00:00:00.000Z",
          is_delete: 0
        }]
      )
    );

    // Mock ReplyRepository
    mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve(replyData));

    // Create use case instance
    const threadDetailsUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository
    });

    //Mock UserRepository
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({id: "user-123",username: "Dicoding"}));
    // Action
    const threadDetails = await threadDetailsUseCase.execute(useCasePayload.id);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentData[0].id);
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
  });
});
