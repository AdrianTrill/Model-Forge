const { ActivityLog, MonitoredUser, User } = require('../models');
const { Op } = require('sequelize');

class MonitoringService {
  constructor() {
    this.checkInterval = 5000; // Check every 5 seconds instead of 5 minutes
    this.timeWindow = 24 * 60 * 60 * 1000; // 24 hours
    this.thresholds = {
      CREATE: 50, // Maximum number of create operations in time window
      READ: 200,  // Maximum number of read operations in time window
      UPDATE: 30, // Maximum number of update operations in time window
      DELETE: 20  // Maximum number of delete operations in time window
    };
  }

  async start() {
    console.log('Starting monitoring service...');
    console.log('Monitoring thresholds:', this.thresholds);
    this.checkSuspiciousActivity();
    setInterval(() => this.checkSuspiciousActivity(), this.checkInterval);
  }

  // Add a method to manually trigger a check
  async triggerCheck() {
    console.log('Manually triggering monitoring check...');
    await this.checkSuspiciousActivity();
  }

  async checkSuspiciousActivity() {
    try {
      console.log('\nChecking for suspicious activity...');
      const timeWindowStart = new Date(Date.now() - this.timeWindow);

      // Get all users who have performed actions in the time window
      const activeUsers = await ActivityLog.findAll({
        where: {
          timestamp: {
            [Op.gte]: timeWindowStart
          }
        },
        attributes: ['userId'],
        group: ['userId']
      });

      console.log(`Found ${activeUsers.length} active users in the last 24 hours`);

      for (const { userId } of activeUsers) {
        console.log(`\nChecking user ${userId}...`);
        
        // Get all actions for this user in the time window
        const userActions = await ActivityLog.findAll({
          where: {
            userId,
            timestamp: {
              [Op.gte]: timeWindowStart
            }
          },
          attributes: ['action'],
          group: ['action']
        });

        console.log(`User ${userId} performed ${userActions.length} different types of actions`);

        let isSuspicious = false;
        let reason = '';

        // Check each action type against thresholds
        for (const { action } of userActions) {
          const count = await ActivityLog.count({
            where: {
              userId,
              action,
              timestamp: {
                [Op.gte]: timeWindowStart
              }
            }
          });

          console.log(`User ${userId} performed ${count} ${action} operations (threshold: ${this.thresholds[action]})`);

          if (count > this.thresholds[action]) {
            isSuspicious = true;
            reason = `High frequency of ${action} operations (${count} in last 24h)`;
            console.log(`User ${userId} is suspicious: ${reason}`);
            break;
          }
        }

        if (isSuspicious) {
          // Add or update monitored user status
          const [monitoredUser, created] = await MonitoredUser.upsert({
            userId,
            reason,
            suspiciousActivityCount: await MonitoredUser.count({ where: { userId } }) + 1,
            lastChecked: new Date(),
            isActive: true
          });

          console.log(`User ${userId} ${created ? 'added to' : 'updated in'} monitored users list`);
        } else {
          // Remove from monitored users if no longer suspicious
          const result = await MonitoredUser.update(
            { isActive: false },
            { where: { userId, isActive: true } }
          );

          if (result[0] > 0) {
            console.log(`User ${userId} removed from monitored users list`);
          }
        }
      }
    } catch (error) {
      console.error('Error in monitoring service:', error);
    }
  }
}

module.exports = new MonitoringService(); 