const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage engine for Multer.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Allow large file uploads (limit set to 1GB)
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 }
});

// POST /api/files/upload - upload a file.
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  res.status(201).json({
    message: 'File uploaded successfully.',
    filename: req.file.filename
  });
});

// GET /api/files/download/:filename - download a file.
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../../uploads', filename);
  res.download(filepath, filename, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found.' });
    }
  });
});

module.exports = router;
