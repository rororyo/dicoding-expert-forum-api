/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id:{
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    thread_id:{
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads(id)',
      onDelete: 'CASCADE'
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    is_delete: {
      type: 'int',
      notNull: true,
      default: 0
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('comments');
};
