'use strict';

const Company = require("../models/company");

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
  db.createTable('programCaredata', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    client_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'programCaredata_client_fk',
        table: 'client',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    company_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'programCaredata_company_fk',
        table: 'company',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    program_care_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'programCaredata_program_care_fk',
        table: 'programCare',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    video_id: {
      type: 'int',
      notNull: false,
      foreignKey: {
        name: 'programCaredata_video_fk',
        table: 'videos',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    description: { type: 'string', length: 255, notNull: true },
    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, callback);
};


exports.down = function(db, callback) {
  db.dropTable('programCaredata', callback);
};

exports._meta = {
  "version": 1
};
