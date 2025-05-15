const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// GET /api/health - Check server health
router.get('/', (req, res) => {
  try {
    const models = modelController.getStore();
    res.status(200).json({ 
      status: 'ok',
      modelsCount: models.length,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server health check failed',
      error: error.message
    });
  }
});

module.exports = router; 