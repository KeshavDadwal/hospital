const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');
const Client = require('./client');  
const Carer = require('./carer');
const Company = require('./company');

const sequelize = createSequelizeInstance();

const Video = sequelize.define('Video', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    video_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    video_frame: {
        type: DataTypes.STRING,
        allowNull: false
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    carer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Carer,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Company,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'videos',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Video;
