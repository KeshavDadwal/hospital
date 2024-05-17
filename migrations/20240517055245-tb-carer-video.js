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
  db.createTable('carerVideo', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    is_seen: { type: 'boolean', notNull: true, defaultValue: false },
    is_like: { type: 'boolean', notNull: true, defaultValue: false },
    video_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'carerVideo_video_fk',
        table: 'videos', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    carer_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'carerVideo_carer_fk',
        table: 'carer',
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
  db.dropTable('carerVideo', callback);
};

exports._meta = {
  "version": 1
};
