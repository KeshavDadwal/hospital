const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'role', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Role;