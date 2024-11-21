class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const formattedComments = this._formatComments(payload.comments);
    this.comments = formattedComments;
  }
  _verifyPayload(payload) {
    const { comments } = payload;
    if (!comments) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (!Array.isArray(comments)) {
      throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
  _formatComments(comments) {
    return comments.map((comment) => {
      this._verifyComment(comment);
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
      };
    });
  }
  _verifyComment(comment) {
    const { id, username, content, date } = comment;
    if (!id || !username || !content || !date) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof content !== "string" 
    ) {
      throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
module.exports = CommentDetails;
