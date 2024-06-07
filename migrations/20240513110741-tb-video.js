'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('videos', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    title: { type: 'string', length: 255, notNull: true },
    video_path: { type: 'string', length: 255, notNull: true },
    video_frame: { type: 'string', length: 255, notNull: true },
    views: { type: 'int', length: 255, notNull: true },
    likes: { type: 'int', length: 255, notNull: true },
    is_attached: { type: 'boolean', defaultValue: false },
    client_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'videos_clients_fk',
        table: 'client',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    carer_id: {
      type: 'int',
      notNull: false,
      foreignKey: {
        name: 'videos_carer_fk',
        table: 'carer',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    company_id: {
      type: 'int',
      notNull: false,
      foreignKey: {
        name: 'videos_company_fk',
        table: 'company',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },

    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('videos', callback);
};

exports._meta = {
  "version": 1
};