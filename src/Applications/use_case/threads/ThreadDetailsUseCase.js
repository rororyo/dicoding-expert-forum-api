const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");

class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(id);
    const threadComments = await this._commentRepository.getCommentsByThreadId(id);
    const formattedThreadComments = new CommentDetails({ comments: threadComments });
    return {
        id: thread.id,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: thread.username,
        comments: formattedThreadComments.comments 
    };
  }
}

module.exports = ThreadDetailsUseCase;
