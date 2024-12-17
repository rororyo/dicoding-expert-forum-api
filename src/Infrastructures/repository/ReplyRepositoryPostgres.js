const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository{
  constructor(pool,idGenerator){
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }
  async postReply(reply,threadId,commentId,ownerId){
    const {content} = reply
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner_id as owner',
      values: [id, commentId, content, ownerId, threadId, 0, createdAt]
    }
    const result = await this._pool.query(query)
    return new AddedReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner
    })
  }
  async getReplyById(replyId){
    const query = {
      text: 'select *,created_at as date from replies WHERE id = $1',
      values: [replyId],
    }
    const result = await this._pool.query(query)
    return {
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner_id,
      date: result.rows[0].date,
      is_delete: result.rows[0].is_delete
    }
  }
  async getRepliesByCommentId(commentId){
    const query = {
      text:'SELECT *,created_at as date FROM replies WHERE comment_id = $1 order by created_at asc',
      values: [commentId],
    }
    const result = await this._pool.query(query)
    return result.rows
  }
  async verifyReplyAvailability(replyId){
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    }
    const result = await this._pool.query(query)
    if(result.rows.length === 0){
      throw new NotFoundError('balasan tidak ditemukan')
    }
  }
  async verifyReplyOwner(replyId,ownerId){
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner_id = $2',
      values: [replyId, ownerId]
    }
    const result = await this._pool.query(query)
    if(result.rows.length === 0){
      throw new AuthorizationError('Anda tidak berhak melakukan aksi ini')
    }
  }
  async deleteReply(replyId){
    const query = {
      text:'UPDATE replies SET is_delete = 1 WHERE id = $1 returning id',
      values: [replyId],
    } 
    await this._pool.query(query)
  }
}

module.exports = ReplyRepositoryPostgres