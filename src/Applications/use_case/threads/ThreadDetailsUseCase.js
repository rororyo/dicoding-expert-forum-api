const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");
const ReplyDetails = require("../../../Domains/replies/entities/ReplyDetails");
const ThreadDetails = require("../../../Domains/threads/entities/ThreadDetails");

class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository,replyRepository,userRepository,likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._userRepository = userRepository;
    this._likeRepository = likeRepository
}

  async execute(useCaseThreadPayload) {
    await this._threadRepository.verifyThreadAvailability(useCaseThreadPayload);
    const thread = await this._threadRepository.getThreadById(useCaseThreadPayload);
    const threadOwner = await this._userRepository.getUserById(thread.owner);
    thread.username = threadOwner.username;
    const formattedThread  = new ThreadDetails({ thread }).thread;
    const threadComments = await this._commentRepository.getCommentsByThreadId(useCaseThreadPayload);
    for(let comment of threadComments) {
      const commentOwner = await this._userRepository.getUserById(comment.owner_id);
      comment.username = commentOwner.username;
      comment.likeCount = parseInt(await this._likeRepository.getLikeCountByCommentId(comment.id))
    }
    const formattedThreadComments = new CommentDetails({ comments: threadComments });
    for(let comment of formattedThreadComments.comments) {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.replies = [];
      for(let reply of replies) {
        const replyOwner = await this._userRepository.getUserById(reply.owner_id);
        reply.username = replyOwner.username;
        const formattedReply = new ReplyDetails( {
          id: reply.id,
          content: reply.content,
          username: reply.username,
          date: reply.date,
          is_delete: reply.is_delete
        } )
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
        title: formattedThread.title,
        body: formattedThread.body,
        date: formattedThread.date,
        username: formattedThread.username,
        comments: formattedThreadComments.comments 
    };
  }
}

module.exports = ThreadDetailsUseCase;
