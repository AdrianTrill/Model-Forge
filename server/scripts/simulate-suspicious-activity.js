const { User, ActivityLog } = require('../models');
const monitoringService = require('../services/monitoringService');

async function simulateSuspiciousActivity() {
  try {
    // Only find the user, do not create or sync
    const user = await User.findOne({ where: { email: 'suspicious@test.com' } });
    if (!user) {
      console.error('Suspicious user does not exist. Please run the init-db script first.');
      process.exit(1);
    }
    console.log(`Found suspicious user: ${user.username}`);

    // Insert activity logs in bulk for performance and to avoid locks
    const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
    const counts = [60, 250, 40, 25]; // Exceed thresholds for all actions
    const logs = [];

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const count = counts[i];
      for (let j = 0; j < count; j++) {
        logs.push({
          userId: user.id,
          action,
          entityType: 'TEST',
          entityId: j + 1,
          details: { action: `TEST_${action}` },
          timestamp: new Date()
        });
      }
    }

    await ActivityLog.bulkCreate(logs);
    console.log('Bulk created suspicious activity logs.');

    // Trigger the monitoring check immediately
    await monitoringService.triggerCheck();
    console.log('Monitoring check completed. Check the admin interface for monitored users.');
  } catch (error) {
    console.error('Error simulating suspicious activity:', error);
  }
}

simulateSuspiciousActivity(); 