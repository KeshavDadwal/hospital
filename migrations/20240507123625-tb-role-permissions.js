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
    role_id: { type: 'int', notNull: true },
    permission_id: { type: 'int', notNull: true },
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
