const User = require('./User');
const Post = require('./Post');
const ActivityLog = require('./ActivityLog');
const MonitoredUser = require('./MonitoredUser');
const sequelize = require('../config/database');

// Define relationships
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Activity Log relationships
User.hasMany(ActivityLog, {
  foreignKey: 'userId',
  as: 'activityLogs'
});

ActivityLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Monitored User relationships
User.hasOne(MonitoredUser, {
  foreignKey: 'userId',
  as: 'monitoredStatus'
});

MonitoredUser.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Post,
  ActivityLog,
  MonitoredUser,
  sequelize
}; 