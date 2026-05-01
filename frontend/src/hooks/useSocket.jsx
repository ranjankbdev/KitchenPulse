import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../config/socket.js';
import { getDeliveryAssignmentsAPI, getOrdersAPI } from '../services/orderService.js';
import showToast from '../utils/toastHelper.js';
import { setDeliveryAssignments, setMyOrders, updateOrderStatus } from '../redux/orderSlice.js';

// status messages for customer notifications
const customerStatusMessages = {
  confirmed: 'Your order has been confirmed.',
  preparing: 'Your order is being prepared.',
  out_for_delivery: 'Your order is out for delivery.',
  delivered: 'Your OTP was verified and the order has been delivered.',
};

// status messages for vendor notifications
const vendorStatusMessages = {
  out_for_delivery: 'Delivery partner has picked up the order.',
  delivered: 'Order has been successfully delivered to the customer.',
};

const roomMap = {
  vendor: 'vendor',
  user: 'user',
  deliveryPartner: 'deliveryPartner',
};

function useSocket() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      socket.disconnect();
      return;
    }

    const roomPrefix = roomMap[userData.role];

    socket.connect();

    // join role-based room after socket connects
    socket.on('connect', () => {
      if (roomPrefix) {
        socket.emit('join_room', `${roomPrefix}:${userData._id}`);
      }
    });

    // ================= USER SOCKET EVENTS =================
    if (userData.role === 'user') {
      socket.on('order_status_updated', async ({ orderId, shopId, status }) => {
        dispatch(updateOrderStatus({ orderId, shopId, status }));
        // refetch orders on delivered to get updated
        if (status === 'delivered') {
          try {
            const updatedOrders = await getOrdersAPI();
            dispatch(setMyOrders(updatedOrders));
          } catch (error) {
            console.error('Failed to fetch orders:', error);
          }
        }
        if (customerStatusMessages[status]) {
          showToast(customerStatusMessages[status], 'info');
        }
      });

      socket.on('delivery:otp_sent', () => {
        showToast('Delivery OTP sent to your email', 'info');
      });
    }

    // ================= VENDOR SOCKET EVENTS =================
    if (userData.role === 'vendor') {
      socket.on('new_order', async () => {
        showToast('New order received!', 'info');
        try {
          const updatedOrders = await getOrdersAPI();
          dispatch(setMyOrders(updatedOrders));
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      });

      socket.on('order_status_updated', async ({ orderId, shopId, status }) => {
        dispatch(updateOrderStatus({ orderId, shopId, status }));

        // refetch orders on delivered to get updated
        if (status === 'delivered') {
          try {
            const updatedOrders = await getOrdersAPI();
            dispatch(setMyOrders(updatedOrders));
          } catch (error) {
            console.log('Failed to fetch orders:', error);
          }
        }
        if (vendorStatusMessages[status]) {
          showToast(vendorStatusMessages[status], 'info');
        }
      });
    }

    // ================= DELIVERY PARTNER EVENTS =================
    if (userData.role === 'deliveryPartner') {
      // delivery partner gets notified for ready_for_pickup
      socket.on('order_status_updated', async () => {
        try {
          const assignments = await getDeliveryAssignmentsAPI();
          dispatch(setDeliveryAssignments(assignments));
          if (assignments.length > 0) {
            showToast(`New delivery assignment available!`, 'info');
          }
        } catch (error) {
          console.error('Failed to fetch assignments:', error);
        }
      });
    }

    return () => {
      socket.off('connect');
      socket.off('new_order');
      socket.off('order_status_updated');
      socket.off('delivery:otp_sent');
      socket.disconnect();
    };
  }, [userData]);
}

export default useSocket;
