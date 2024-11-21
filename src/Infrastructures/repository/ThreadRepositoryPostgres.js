const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const PostedThread = require("../../Domains/threads/entities/PostedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository{
  constructor(pool,idGenerator){
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }
  async addThread(thread){
    const {title,body,owner} = thread
    const id = `thread-h_${this._idGenerator()}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5 ,$6) returning id,title,owner',
      values: [id, title, body, owner, createdAt, updatedAt]
    }
    const result = await this._pool.query(query)
    const payload = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: body,
      owner: result.rows[0].owner
    }
    return new PostedThread(payload)
  }
  async verifyThreadAvailability(id){
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if(result.rows.length === 0){
      throw new NotFoundError('thread tidak ditemukan')
    }
  }
  async getThreadById(threadId){
    const query = {
      text: 'SELECT *,created_at as date from threads WHERE id = $1',
      values: [threadId]
    }
    const result = await this._pool.query(query)
    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres