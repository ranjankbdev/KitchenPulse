import { io } from 'socket.io-client';

const socket = io('https://kitchenpulse.onrender.com', {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export default socket;
