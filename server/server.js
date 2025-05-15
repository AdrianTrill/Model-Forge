const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const modelRoutes = require('./routes/modelRoutes');
const fileRoutes = require('./routes/fileRoutes');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const monitoringService = require('./services/monitoringService');

const app = express();

// Increase payload limits for large file uploads.
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ extended: true, limit: '1gb' }));
app.use(cors());

app.use('/api/models', modelRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;

// Create HTTP server and attach Socket.IO.
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Import modelController for real-time updates and background operations.
const modelController = require('./controllers/modelController');

// Function to generate a random model.
function generateRandomModel() {
  const id = Date.now() + Math.floor(Math.random() * 1000);
  const statuses = ["Training", "Completed", "Deprecated"];
  const types = ["CNN", "RNN", "Transformer"];
  const datasets = ["CIFAR-100", "Open Assistant", "Custom Dataset"];
  const randomDate = new Date(Date.now() - Math.random() * 10000000000);
  const day = ("0" + randomDate.getDate()).slice(-2);
  const month = ("0" + (randomDate.getMonth() + 1)).slice(-2);
  const year = randomDate.getFullYear();
  const trainingDate = `${day}/${month}/${year}`;
  return {
    id,
    name: `Auto Model ${id}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    datasetUsed: datasets[Math.floor(Math.random() * datasets.length)],
    trainingDate,
    accuracy: Math.floor(Math.random() * 41) + 60,
    price: Math.floor(Math.random() * 4501) + 500
  };
}

// Global variable to hold the auto-generation interval.
let autoGenerationInterval = null;

// Socket.IO: When a client connects, set up event listeners.
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.emit('updateModels', modelController.getStore());

  // Listen for the toggleGeneration event.
  socket.on('toggleGeneration', (shouldRun) => {
    console.log(`toggleGeneration event received: ${shouldRun}`);
    if (shouldRun && !autoGenerationInterval) {
      // Start auto-generation.
      autoGenerationInterval = setInterval(() => {
        const newModel = generateRandomModel();
        console.log("Auto-generating model:", newModel);
        modelController.__addModel(newModel);
        io.emit('updateModels', modelController.getStore());
      }, 5000);
      console.log("Auto-generation started.");
    } else if (!shouldRun && autoGenerationInterval) {
      clearInterval(autoGenerationInterval);
      autoGenerationInterval = null;
      console.log("Auto-generation stopped.");
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the monitoring service
monitoringService.start().catch(console.error);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} and bound to 0.0.0.0`);
});
