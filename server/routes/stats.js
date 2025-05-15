const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get user activity statistics with optimized query
router.get('/user-activity', async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        u.id,
        u.username,
        COUNT(p.id) as postCount,
        MAX(p.createdAt) as lastPostDate,
        AVG(LENGTH(p.content)) as avgPostLength,
        COUNT(DISTINCT DATE(p.createdAt)) as activeDays,
        (
          SELECT COUNT(*) 
          FROM Posts 
          WHERE userId = u.id 
          AND createdAt >= datetime('now', '-7 days')
        ) as postsLastWeek
      FROM Users u
      LEFT JOIN Posts p ON u.id = p.userId
      GROUP BY u.id, u.username
      ORDER BY postCount DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user activity stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get post creation trends with optimized query
router.get('/post-trends', async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        strftime('%Y-%m-%d', createdAt) as date,
        COUNT(*) as postCount,
        AVG(LENGTH(content)) as avgPostLength,
        COUNT(DISTINCT userId) as uniqueUsers
      FROM Posts
      GROUP BY strftime('%Y-%m-%d', createdAt)
      ORDER BY date DESC
      LIMIT 30
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching post trends:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 