import { IoIosArrowRoundBack } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);

  const totalQuantity = cartItems?.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-screen bg-[#fff9f6] flex justify-center px-6 overflow-hidden">
      <div className="w-full max-w-[800px] flex flex-col h-screen py-6">
        {/* Fixed Top */}
        <div className="flex items-center gap-2 mb-6">
          <button
            className="z-[10] hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
            onClick={() => navigate('/')}
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </button>
          <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>

        {/* Scrollable Middle */}
        {totalQuantity === 0 ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-10 py-12 flex flex-col items-center gap-4 max-w-sm w-full">
              <div className="bg-[#ff4d2d]/10 p-5 rounded-full">
                <FiShoppingCart size={40} className="text-[#ff4d2d]" />
              </div>

              <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
              <p className="text-sm text-gray-500 text-center">
                Looks like you haven’t added anything yet.
              </p>

              <button
                onClick={() => navigate(-1)}
                className="mt-2 bg-[#ff4d2d] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e64526] transition cursor-pointer"
              >
                Browse Food
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems?.map((item) => (
                <CartItemCard item={item} key={item._id} />
              ))}
            </div>
            {/* Fixed Bottom */}
            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
              <h1 className="text-lg font-semibold">Total Amount</h1>
              <span className="text-xl font-bold text-[#ff4d2d]">₹{totalAmount}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] hover:-translate-y-px transition cursor-pointer"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
