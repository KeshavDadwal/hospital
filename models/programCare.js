const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const ProgramCare = sequelize.define('ProgramCare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'programCare',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProgramCare;