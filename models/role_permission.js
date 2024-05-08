const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const Role_Permission = sequelize.define('Role_Permission', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'role_permission', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Role_Permission;