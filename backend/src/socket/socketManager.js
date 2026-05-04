import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Config from '../config/index.js';

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: Config.frontendUrl,
      credentials: true,
    },
  });

  // verify JWT from cookie
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers?.cookie || '';
      const token = cookies
        .split(';')
        .find((c) => c.trim().startsWith('token='))
        ?.split('=')[1]
        ?.trim();
      if (!token) return next(new Error('Unauthorized'));

      const decoded = jwt.verify(token.split(';')[0], Config.secretKey);
      socket.userId = decoded.id;

      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    // client joins a room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    // delivery partner emits their location
    socket.on('location_update', ({ customerId, latitude, longitude }) => {
      io.to(`user:${customerId}`).emit('partner_location_updated', { latitude, longitude });
    });

    socket.on('disconnect', () => {});
  });
};

// helper to get io instance anywhere in backend
const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export { initSocket, getIO };
