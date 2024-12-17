/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      refences: 'threads(id)',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      refences: 'comments(id)',
      onDelete: 'cascade',
    },
    user_id:{
      type: 'VARCHAR(50)',
      notNull: true,
      refences: 'users(id)',
      onDelete: 'cascade'
    },
  })
};

exports.down = pgm => {
  pgm.dropTable('likes');
};
