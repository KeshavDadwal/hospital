const { DataTypes } = require('sequelize');
const { createSequelizeInstance }= require('../connection'); 


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
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'videos',
  timestamps: false // 
});

module.exports = Video;
