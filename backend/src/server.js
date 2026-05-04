import mongoose from 'mongoose';
import http from 'http';
import Config from './config/index.js';
import app from './app.js';
import { initSocket } from './socket/socketManager.js';

// handle unhandled promise rejections to prevent silent failures
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// connect to MongoDB and start the server
const start = async () => {
  try {
    await mongoose.connect(Config.mongoUri);
    console.log(`Connected to Database...`);

    const server = http.createServer(app);
    initSocket(server);

    server.listen(Config.port, () => {
      console.log(`Server listening on port ${Config.port}...`);
    });
  } catch (error) {
    console.log(`Could not connect to database... ${error.message}`);
    process.exit(1);
  }
};

start();
