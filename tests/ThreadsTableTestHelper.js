/* instanbul ignore files */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'dicoding',
    body = 'dicoding.com',
    created_at = new Date(),
    owner = 'user-123',
    updated_at = new Date(), // Add this
  }){
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING RETURNING id,title,owner',
      values: [id, title, body, owner, created_at, updated_at] // Use both created_at and updated_at
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