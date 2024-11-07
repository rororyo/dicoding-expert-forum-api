const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const PostedComment = require("../../Domains/comments/entities/PostedComment");

class CommentRepositoryPostgres  extends CommentRepository{
  constructor(pool,idGenerator){
    super();
    this._pool = pool
    this._idGenerator = idGenerator
  }
  async addComment(newComment){
    const {content,threadId,owner} = newComment
    const id = `comment-_pby_${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner_id',
      values: [id, threadId, content, owner, 0, createdAt, updatedAt]
    }
    const result = await this._pool.query(query)
    return new PostedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner_id
    })
  }
  async getCommentById(commentId){
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }
    const result = await this._pool.query(query)
    if(result.rows.length === 0){
      throw new NotFoundError('komentar tidak ditemukan')
    }
    return result.rows
  }
  async getCommentsByThreadId(threadId){
    const query = {
      text: 'SELECT comments.id,users.username,comments.content,comments.created_at as date FROM comments join users on comments.owner_id = users.id WHERE thread_id = $1 ',
      values: [threadId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }

  async verifyCommentOwner(commentId, ownerId){
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner_id = $2',
      values: [commentId, ownerId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }
  async deleteComment(threadId, commentId, ownerId){
    await this.verifyCommentOwner(commentId,ownerId)
    const deletedComment = '**komentar telah dihapus**'
    const query = {
      text: 'UPDATE comments SET  content = $1,is_delete = 1 WHERE id = $2 AND thread_id = $3 returning id',
      values: [deletedComment,commentId,threadId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new InvariantError('komentar gagal di hapus')
    }
  }
}

module.exports = CommentRepositoryPostgres