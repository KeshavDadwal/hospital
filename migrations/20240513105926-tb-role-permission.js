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
  db.createTable('role_permission', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    role_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'role_permission_role_fk',
        table: 'roles', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    permission_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'role_permission_permission_fk',
        table: 'permissions', 
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
  db.dropTable('role_permission', callback);
};

exports._meta = {
  "version": 1
};








