import { IoCheckmarkCircle } from 'react-icons/io5';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50 px-4">
      {/* Card Container */}
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-orange-100 relative text-center">
        {/* Back Button */}
        <span
          onClick={() => navigate('/')}
          className="absolute top-5 left-5 hover:bg-[#ff4d2d]/20 p-1 rounded cursor-pointer"
        >
          <IoIosArrowRoundBack size={32} className="text-[#ff4d2d]" />
        </span>

        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-5 rounded-full mb-5">
            <IoCheckmarkCircle className="text-green-500 w-14 h-14" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed 🎉</h1>
          <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
            Your order has been successfully placed. You can track it's progress and stay updated in
            "My Orders" section.
          </p>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
              View Orders
            </button>

            <button
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
