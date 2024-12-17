/* instanbul ignore files */
const pool = require("../src/Infrastructures/database/postgres/pool")

const LikeTableTestHelper = {
  async addLike({
    id = "like-123",
    threadId = "thread-123",
    commentId = "comment-123",
    userId = "user-123"
  }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
      values: [id, threadId,commentId, userId]
    }
    await pool.query(query)
  },
  async findLikeById(likeId) {
    const query = {
      text: "SELECT * FROM likes WHERE id = $1",
      values: [likeId]
    }
    const result = await pool.query(query)
    return result.rows
  },
  async findLikeByCommentId(commentId) {
    const query = {
      text: "SELECT * FROM likes WHERE comment_id = $1",
      values: [commentId]
    }
    const result = await pool.query(query)
    return result.rows
  },
  async cleanTable() {
    await pool.query("DELETE FROM likes WHERE 1=1")
  },
}

module.exports = LikeTableTestHelper