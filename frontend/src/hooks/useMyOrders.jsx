import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAPI } from '../services/orderService';
import { setMyOrders } from '../redux/orderSlice';
import showToast from '../utils/toastHelper';

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrdersAPI();
        dispatch(setMyOrders(result));
      } catch (error) {
        showToast(error, 'error');
      }
    };
    
    fetchOrders();
  }, [userData]);
}

export default useGetMyOrders;
