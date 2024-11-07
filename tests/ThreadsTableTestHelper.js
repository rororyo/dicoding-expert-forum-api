/* instanbul ignore files */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'dicoding',
    body = 'dicoding.com',
    created_at = new Date(),
    owner = 'user-123',
  }){
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5 ,$6) returning id,title,owner',
      values: [id, title, body, owner, created_at,created_at]
    }
    const result = await pool.query(query);
    return result.rows;
    
  },
  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    }

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
}
module.exports = ThreadsTableTestHelper