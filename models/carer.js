const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const Carer = sequelize.define('Carer',{
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    joining_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    blocked:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
}, {
    tableName: 'carer', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Carer;