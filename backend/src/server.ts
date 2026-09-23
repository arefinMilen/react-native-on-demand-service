import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';

import { registerSocketHandlers } from './sockets/socket.handler.js';

const server = http.createServer(app);

// Initialize Socket.io Server instance
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Register real-time Socket event listeners
registerSocketHandlers(io);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Healthcheck: http://localhost:${PORT}/api/v1/health`);
});

process.on('unhandledRejection', (err: any) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down gracefully...', err);
  server.close(() => process.exit(1));
});
