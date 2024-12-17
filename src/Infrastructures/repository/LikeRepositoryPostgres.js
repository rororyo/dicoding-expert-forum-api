const LikeRepository = require("../../Domains/likes/likeRepository");

class LikeRepositoryPostgres extends LikeRepository{
  constructor(pool,idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async verifyLikeAvailability(threadId,commentId,userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
      values: [threadId,commentId,userId]
    }
    const result = await this._pool.query(query);
    return result.rows.length > 0
  }
  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT count(*) FROM likes WHERE comment_id = $1 GROUP BY comment_id',
      values: [commentId],
    };

    const result = await this._pool.query(query);
  
    if (result.rows.length === 0) {
      return "0"; 
    }
  
    return result.rows[0].count;
  }
  async likeAComment(threadId,commentId,userId){
    const id = `like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO likes VALUES($1,$2,$3,$4)',
      values: [id,threadId,commentId,userId]
    }
    await this._pool.query(query)
  }
  async unlikeAComment(threadId,commentId,userId){
    const query = {
      text: 'DELETE FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
      values: [threadId,commentId,userId]
    }
    await this._pool.query(query)
  }
}

module.exports = LikeRepositoryPostgres