import { useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { MdOutlineReceiptLong } from 'react-icons/md';
import { MdRestaurantMenu } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CustomerOrderCard from '../components/CustomerOrderCard';
import VendorOrderCard from '../components/VendorOrderCard';

function OrdersPage() {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const { myOrders } = useSelector((state) => state.order);

  const isUser = userData?.role === 'user';
  const isVendor = userData?.role === 'vendor';

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50 px-4 py-10">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-orange-100 relative">
        <div className="flex items-center mb-6 w-full">
          <button
            onClick={() => navigate('/')}
            className="z-10 hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </button>

          <h1 className="text-2xl font-semibold text-gray-800 ml-3">
            {isUser ? 'Your Orders' : 'Incoming Orders'}
          </h1>
        </div>

        {!myOrders?.length ? (
          <div className="flex flex-col items-center justify-center text-center min-h-75">
            <div className="bg-[#ff4d2d]/10 p-4 rounded-full mb-4">
              {isUser ? (
                <MdOutlineReceiptLong className="text-[#ff4d2d] text-5xl" />
              ) : (
                <MdRestaurantMenu className="text-[#ff4d2d] text-5xl" />
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {isUser ? 'No orders yet' : 'No incoming orders'}
            </h2>

            <p className="text-gray-500 max-w-sm mb-6">
              {isUser
                ? 'Looks like you haven’t placed any orders yet. Start exploring and order your favorite food.'
                : 'No orders yet. Customer orders will appear here once they start placing them.'}
            </p>

            <button
              onClick={() => navigate('/')}
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm cursor-pointer"
            >
              {isUser ? 'Explore Food' : 'Go to Dashboard'}
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {myOrders.map((order) => {
              if (isUser) return <CustomerOrderCard data={order} key={order._id} />;
              if (isVendor) return <VendorOrderCard data={order} key={order._id} />;
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
