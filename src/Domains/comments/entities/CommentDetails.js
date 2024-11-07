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
    if(!Array.isArray(comments)) {
      throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
    if (comments.length > 0) {
      if (
        !Array.isArray(comments) ||
        typeof comments[0].id !== "string" ||
        typeof comments[0].username !== "string" ||
        typeof comments[0].date !== "string" ||
        typeof comments[0].content !== "string"
      ) {
        throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
      }
    }
  }
  _formatComments(comments) {
    if (comments.length === 0) {
      return comments;
    }
    return comments.map((comment) => {
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_deleted
          ? "**komentar telah dihapus**"
          : comment.content,
      };
    });
  }
}
module.exports = CommentDetails;
