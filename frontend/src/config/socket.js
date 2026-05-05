import { io } from 'socket.io-client';

const socket = io('https://kitchenpulse.onrender.com', {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  auth: (cb) => {
    cb({ token: localStorage.getItem('token') });
  },
});

export default socket;
