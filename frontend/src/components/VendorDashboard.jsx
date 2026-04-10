import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsShop } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit } from 'react-icons/fi';
import { useEffect } from 'react';
import { MdRestaurantMenu } from 'react-icons/md';
import { setMyShopData } from '../redux/vendorSlice.js';
import { getMyShopAPI } from '../services/shopService.js';
import Navbar from './Navbar';
import showToast from '../utils/toastHelper';
import VendorItemCard from '../components/VendorItemCard.jsx';
import useGetMyOrders from '../hooks/useMyOrders.jsx';

function VendorDashboard() {
  const { userData } = useSelector((state) => state.user);
  useGetMyOrders();
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

      {/* NO SHOP */}
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

      {/* SHOP EXISTS */}
      {myShopData && (
        <>
          <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
              <BsShop className="text-[#ff4d2d] w-14 h-14 " />
              <span className="capitalize">{myShopData?.name}</span> Dashboard
            </h1>

            <div className="w-full max-w-xl 2xl:max-w-3xl bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 relative">
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

          {/* MENU SECTION */}
          <div className="px-4 sm:px-6">
            {/* HEADER */}
            <div className="flex justify-center mt-8 mb-6 w-full">
              <div className="w-full flex justify-between items-center max-w-xl 2xl:max-w-3xl">
                <h2 className="text-xl font-semibold text-gray-800">Restaurant Menu Items</h2>

                <button
                  onClick={() => navigate('/vendor/shop/items/new')}
                  className="flex justify-center items-center bg-[#ff4d2d] text-white px-4 py-2 rounded-lg hover:bg-orange-600 gap-1 whitespace-nowrap cursor-pointer"
                >
                  <FaPlus size={14} /> Add Item
                </button>
              </div>
            </div>

            {/* EMPTY MENU */}
            {myShopData?.items?.length === 0 && (
              <div className="flex justify-center items-center p-4 sm:p-6">
                <div className="w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-xl 2xl:max-w-3xl">
                  <div className="flex flex-col items-center text-center">
                    <MdRestaurantMenu className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      No Menu Items Yet
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Add your first dish to start building your restaurant menu.
                    </p>
                    <button
                      className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate('/vendor/shop/items/new')}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            )}
            {myShopData?.items?.length > 0 && (
              <div className="flex flex-col mx-auto justify-center items-center gap-4 w-full max-w-xl 2xl:max-w-3xl mb-10">
                {myShopData?.items?.map((item) => (
                  <VendorItemCard data={item} key={item._id} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VendorDashboard;
