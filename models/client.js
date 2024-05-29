const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');
const Company = require('./company'); 

const sequelize = createSequelizeInstance();

const Client = sequelize.define('Client', {
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
  joining_date: {
    type: DataTypes.DATEONLY, // Use DATEONLY for just the date without time
    allowNull: false
  }
}, {
  tableName: 'client',
  timestamps: true, // Enabling Sequelize-managed timestamps
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Company.hasMany(Client, { foreignKey: 'company_id' });
Client.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = Client;
