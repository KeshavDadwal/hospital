'use strict';

var bcrypt = require('bcrypt');

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
    db.createTable('company', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        role_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'company_role_fk',
                table: 'roles',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                },
                mapping: 'id'
            }
        },
        name: { type: 'string', length: 255, notNull: true },
        email: { type: 'string', length: 255, notNull: true, unique: true },
        password: { type: 'string', length: 255, notNull: true },
        phone: { type: 'string', length: 20, notNull: true },
        address: { type: 'string', length: 255, notNull: true },
        website: { type: 'string', length: 255 },
        created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
        updated_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
    },callback);
};

exports.down = function(db, callback) {
    db.dropTable('company', callback);
};

exports._meta = {
    "version": 1
};
