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
  db.createTable('client', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    company_id: { type: 'int', notNull: true },
    picture: { type: 'string', length: 255, notNull: true },
    firstname: { type: 'string', length: 255, notNull: true },
    lastname: { type: 'string', length: 255, notNull: true },
    email: { type: 'string', length: 255, notNull: true, unique: true },
    joining_date: { type: 'date', notNull: true },
    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('client', callback);
};

exports._meta = {
  "version": 1
};
