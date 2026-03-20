import { useDispatch, useSelector } from 'react-redux';
import { BsShop } from 'react-icons/bs';
import { useEffect } from 'react';
import { setMyShopData } from '../redux/vendorSlice.js';
import { getMyShopAPI } from '../services/shopService.js';
import Navbar from './Navbar';
import showToast from '../utils/toastHelper';

function VendorDashboard() {
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.vendor);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await getMyShopAPI();
        dispatch(setMyShopData(result));
      } catch (error) {
        showToast(error, 'error');
      }
    };

    fetchShop();
  }, [userData, dispatch]);

  return (
    <div>
      <Navbar />

      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <BsShop className="text-[#ff4d2d] w-14 h-14 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Bring Your Restaurant Online
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Create your restaurant profile, add your menu items, and start serving customers
                online through <b>KitchenPulse</b>.
              </p>
              <button
                type="button"
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
              >
                Create Restaurant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;
