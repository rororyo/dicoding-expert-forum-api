const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");
const ThreadDetailsUseCase = require("../../../../Applications/use_case/threads/ThreadDetailsUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }
  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const {id: owner} = request.auth.credentials;
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner
    };
    const thread = await addThreadUseCase.execute(useCasePayload);
    return h.response({
      status: 'success',
      data: {
        addedThread: thread
      }
    }).code(201);
  }
  async getThreadByIdHandler(request, h) {
    const threadDetailsUseCase = this._container.getInstance(ThreadDetailsUseCase.name);
    const useCasePayload = {
      id: request.params.threadId
    }
    const thread = await threadDetailsUseCase.execute(useCasePayload.id);
    return h.response({
      status: 'success',
      data: {
        thread
      }
    }).code(200);
  }
}
module.exports = ThreadsHandler;