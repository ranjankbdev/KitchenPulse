import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsShop } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { useEffect } from 'react';
import { setMyShopData } from '../redux/vendorSlice.js';
import { getMyShopAPI } from '../services/shopService.js';
import Navbar from './Navbar';
import showToast from '../utils/toastHelper';

function VendorDashboard() {
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.vendor);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
                onClick={() => navigate('/vendor/shop/new')}
                type="button"
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
              >
                Create Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <>
          <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
              <BsShop className="text-[#ff4d2d] w-14 h-14 " />
              <span className="capitalize">{myShopData?.name}</span> Dashboard
            </h1>

            <div className="w-full max-w-[530px] 2xl:max-w-[700px] bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 relative">
              <div
                className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-lg shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
                onClick={() => navigate('/vendor/shop/edit')}
              >
                <FiEdit size={20} className="mb-1" />
              </div>
              <img
                src={myShopData.imageUrl}
                alt={myShopData.name}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {myShopData.name}
                </h1>
                <p className="text-gray-500 capitalize">{myShopData.address}</p>
                <p className="text-gray-500 mb-4 capitalize">
                  {myShopData.city},{myShopData.state}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VendorDashboard;
