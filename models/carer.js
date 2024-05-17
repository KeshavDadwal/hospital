const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');
const Company = require('./company'); 

const sequelize = createSequelizeInstance();

const Carer = sequelize.define('Carer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    joining_date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
        allowNull: true
    }
}, {
    tableName: 'carer',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Company.hasMany(Carer, { foreignKey: 'company_id' });
Carer.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = Carer;
