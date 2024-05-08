const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const CarerLogin = sequelize.define('CarerLogin',{
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    devicetype: {
        type: DataTypes.STRING,
        allowNull: false
    },
    devicetoken:{
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'carerlogin', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = CarerLogin;