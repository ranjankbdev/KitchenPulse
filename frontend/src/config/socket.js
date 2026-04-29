import { io } from 'socket.io-client';
import { BASE_URL } from './config.js';

// single shared socket instance for entire app
const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
