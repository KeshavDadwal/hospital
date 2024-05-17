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
  db.createTable('programCare', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    title: { type: 'string',length: 255, notNull: true },
    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, function(err) {
      if (err) return callback(err);
      var programCare1 = db.insert('programCare', ['title'], ['AM']);
      var programCare2 = db.insert('programCare', ['title'], ['TEA']);
      var programCare3 = db.insert('programCare', ['title'], ['NOON']);
      var programCare4 = db.insert('programCare', ['title'], ['NIGHT']);

      Promise.all([programCare1, programCare2, programCare3,programCare4])
          .then(function() {
              callback();
          })
          .catch(function(err) {
              callback(err);
          });
  });
};

exports.down = function(db, callback) {
  db.dropTable('programCare', callback);
};

exports._meta = {
  "version": 1
};
