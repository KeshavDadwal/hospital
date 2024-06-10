const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');
const Client = require('./client');
const Company = require('./company');
const ProgramCare = require('./programCare');
const Video = require('./video');

const sequelize = createSequelizeInstance();

const ProgramCareData = sequelize.define('ProgramCareData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    program_care_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProgramCare,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Video,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'programCaredata',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Client.hasMany(ProgramCareData, { foreignKey: 'client_id' });
Company.hasMany(ProgramCareData, { foreignKey: 'company_id' });
ProgramCare.hasMany(ProgramCareData, { foreignKey: 'program_care_id' });
ProgramCareData.belongsTo(Client, { foreignKey: 'client_id' });
ProgramCareData.belongsTo(Company, { foreignKey: 'company_id' });
ProgramCareData.belongsTo(ProgramCare, { foreignKey: 'program_care_id' });
ProgramCareData.belongsTo(Video, { foreignKey: 'video_id' });
Video.hasMany(ProgramCareData, { foreignKey: 'video_id' });
module.exports = ProgramCareData;

