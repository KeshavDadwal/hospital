const { DataTypes } = require('sequelize');
const { createSequelizeInstance } = require('../connection');

const sequelize = createSequelizeInstance();

const Video = require('./video');
const Carer = require('./carer');

const CarerVideo = sequelize.define('CarerVideo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  is_seen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_like: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Video,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  carer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Carer, 
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'carerVideo',
  timestamps: true,
  createdAt: 'created_at', 
updatedAt: 'updated_at'  
});

Video.hasMany(CarerVideo, { foreignKey: 'video_id' });
Carer.hasMany(CarerVideo, { foreignKey: 'carer_id' });
CarerVideo.belongsTo(Video, { foreignKey: 'video_id' });
CarerVideo.belongsTo(Carer, { foreignKey: 'carer_id' });

module.exports = CarerVideo;
