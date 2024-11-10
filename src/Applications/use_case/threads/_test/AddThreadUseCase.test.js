const PostedThread = require("../../../../Domains/threads/entities/PostedThread")
const PostThread = require("../../../../Domains/threads/entities/PostThread") // Assuming PostThread is your UseCase
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository")
const AddThreadUseCase = require("../AddThreadUseCase")

describe('AddThreadUseCase', () => { 
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const UseCaseThreadPayload = new PostThread ({
      owner: 'user-123',
      title: 'dicoding',
      body: 'body test 123'
    })

    const mockAddedThread = new PostedThread({
      id: 'thread-123',
      title: 'dicoding',
      body: 'body test 123',
      owner: 'user-123'
    })

    const mockThreadRepository = new ThreadRepository()
    mockThreadRepository.addThread = jest.fn().mockImplementation((payload) => {
      return new PostedThread({
        id: 'thread-123',
        title: payload.title,
        body: payload.body,
        owner: payload.owner
      });
    });

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(UseCaseThreadPayload)

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread)
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(UseCaseThreadPayload)
  })
})
