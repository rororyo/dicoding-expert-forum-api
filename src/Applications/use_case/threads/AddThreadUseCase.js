const PostThread = require("../../../Domains/threads/entities/PostThread")

class AddThreadUseCase{
  constructor({threadRepository}){
    this._threadRepository = threadRepository
  }
  async execute(useCaseThreadPayload){
    const thread = new PostThread(useCaseThreadPayload)
    return this._threadRepository.addThread(thread)
  }
}

module.exports = AddThreadUseCase