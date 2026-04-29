import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../config/socket.js';

function useSocket() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) {
      socket.disconnect();
      return;
    }

    socket.connect();

    socket.on('connect', () => {});

    return () => {
      socket.disconnect();
    };
  }, [userData]);
}

export default useSocket;
