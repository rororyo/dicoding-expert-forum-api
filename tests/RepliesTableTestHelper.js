/* instanbul ignore files */
const pool = require("../src/Infrastructures/database/postgres/pool")

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'sebuah reply',
    ownerId = 'user-123',
    threadId = 'thread-123',
    isDelete = 0,
    created_at = new Date(),
  }){
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING RETURNING id, content, owner_id as owner',
      values: [id, commentId, content, ownerId, threadId, isDelete, created_at],
    }
    const result = await pool.query(query)
    return result.rows
  },
  async getReplyById(replyId){
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    }
    const result = await pool.query(query)
    return result.rows
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
}

module.exports = RepliesTableTestHelper