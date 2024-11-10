const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");
const ReplyDetails = require("../../../Domains/replies/entities/ReplyDetails");
const ThreadDetails = require("../../../Domains/threads/entities/ThreadDetails");

class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository,replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
}

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(id);
    const thread = await this._threadRepository.getThreadById(id);
    const formattedThread  = new ThreadDetails({ thread }).thread;
    const threadComments = await this._commentRepository.getCommentsByThreadId(id);
    const formattedThreadComments = new CommentDetails({ comments: threadComments });
    for(let comment of formattedThreadComments.comments) {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.replies = [];
      for(let reply of replies) {
        const formattedReply = new ReplyDetails( reply )
        comment.replies.push({
          id: formattedReply.id,
          content:formattedReply.content,
          date:formattedReply.date,
          username:formattedReply.username
        })
      }
    }
    return {
        id: formattedThread.id,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: thread.username,
        comments: formattedThreadComments.comments 
    };
  }
}

module.exports = ThreadDetailsUseCase;
