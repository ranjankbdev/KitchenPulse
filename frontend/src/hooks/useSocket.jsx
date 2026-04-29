import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../config/socket.js';
import { getOrdersAPI } from '../services/orderService.js';
import showToast from '../utils/toastHelper.js';
import { setMyOrders } from '../redux/orderSlice.js';

function useSocket() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      socket.disconnect();
      return;
    }

    socket.connect();

    socket.on('connect', () => {
      if (userData.role === 'vendor') {
        socket.emit('join_room', `vendor:${userData._id}`);
      }
    });

    if (userData.role === 'vendor') {
      socket.on('new_order', async () => {
        showToast('New order received!', 'info');
        const updatedOrders = await getOrdersAPI();
        dispatch(setMyOrders(updatedOrders));
      });
    }

    return () => {
      socket.off('connect');
      socket.off('new_order');
      socket.disconnect();
    };
  }, [userData]);
}

export default useSocket;
