require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Render Deployment Trigger: 2026-08-12
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle Unhandled Promise Rejections (for safety)
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
