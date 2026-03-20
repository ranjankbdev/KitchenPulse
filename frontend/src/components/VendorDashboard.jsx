import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/vendorSlice.js';
import { useEffect } from 'react';
import { getMyShopAPI } from '../services/shopService.js';
import Navbar from './Navbar';
import showToast from '../utils/toastHelper';

function VendorDashboard() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await getMyShopAPI();
        dispatch(setMyShopData(result));
        console.log(result);
      } catch (error) {
        showToast(error, 'error');
      }
    };

    fetchShop();
  }, [userData, dispatch]);

  return (
    <div>
      <Navbar />
    </div>
  );
}

export default VendorDashboard;
