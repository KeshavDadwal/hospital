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
    db.createTable('roles', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: { type: 'string', length: 255, notNull: true },
        description: { type: 'string', length: 255, notNull: true },
        created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
        updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
    }, function(err) {
        if (err) return callback(err);
        var adminPromise = db.insert('roles', ['name', 'description'], ['admin', 'Administrator role']);
        var userPromise = db.insert('roles', ['name', 'description'], ['user', 'Regular user role']);

        Promise.all([adminPromise, userPromise])
            .then(function() {
                callback();
            })
            .catch(function(err) {
                callback(err);
            });
    });
};

exports.down = function(db, callback) {
    db.dropTable('roles', callback);
};

exports._meta = {
    "version": 1
};
