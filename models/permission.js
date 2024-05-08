const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'permission', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Permission;