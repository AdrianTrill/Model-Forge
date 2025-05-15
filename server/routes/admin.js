const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { MonitoredUser, User, ActivityLog } = require('../models');
const monitoringService = require('../services/monitoringService');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all monitored users
router.get('/monitored-users', isAdmin, async (req, res) => {
  try {
    console.log('Fetching monitored users...');
    
    const monitoredUsers = await MonitoredUser.findAll({
      where: { isActive: true },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'role']
      }],
      order: [['lastChecked', 'DESC']]
    });

    console.log(`Found ${monitoredUsers.length} monitored users`);
    console.log('Monitored users:', monitoredUsers.map(mu => ({
      id: mu.id,
      userId: mu.userId,
      username: mu.user?.username,
      email: mu.user?.email,
      reason: mu.reason,
      suspiciousActivityCount: mu.suspiciousActivityCount,
      lastChecked: mu.lastChecked
    })));

    res.json({ monitoredUsers });
  } catch (error) {
    console.error('Error fetching monitored users:', error);
    res.status(500).json({ error: 'Error fetching monitored users' });
  }
});

// Get monitoring statistics
router.get('/monitoring-stats', isAdmin, async (req, res) => {
  try {
    console.log('Fetching monitoring statistics...');
    
    const stats = {
      totalMonitored: await MonitoredUser.count({ where: { isActive: true } }),
      totalUsers: await User.count(),
      recentActivity: await ActivityLog.findAll({
        limit: 10,
        order: [['timestamp', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['username']
        }]
      })
    };

    console.log('Monitoring stats:', stats);
    res.json({ stats });
  } catch (error) {
    console.error('Error fetching monitoring stats:', error);
    res.status(500).json({ error: 'Error fetching monitoring stats' });
  }
});

// Trigger monitoring check manually
router.post('/trigger-monitoring', isAdmin, async (req, res) => {
  try {
    console.log('Manually triggering monitoring check...');
    await monitoringService.triggerCheck();
    res.json({ message: 'Monitoring check triggered successfully' });
  } catch (error) {
    console.error('Error triggering monitoring check:', error);
    res.status(500).json({ error: 'Error triggering monitoring check' });
  }
});

module.exports = router; 