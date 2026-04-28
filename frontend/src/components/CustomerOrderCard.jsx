import { useNavigate } from 'react-router-dom';
import { IoReceiptOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { rateItemAPI } from '../services/ratingService.js';
import { formatDateTime } from '../utils/dateFormatter.js';
import showToast from '../utils/toastHelper.js';

function StarRating({ itemId, orderId, existingRating }) {
  const [selected, setSelected] = useState(existingRating || 0);
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(!!existingRating);
  const [loading, setLoading] = useState(false);

  const handleRate = async (star) => {
    if (rated || loading) return;
    try {
      setLoading(true);
      const res = await rateItemAPI({ rating: star, orderId, itemId });
      setSelected(star);
      setRated(true);
      showToast('Rating submitted successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
      setRated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (existingRating) {
      setSelected(existingRating);
      setRated(true);
    }
  }, [existingRating]);

  if (rated) {
    return <p className="text-xs text-green-600 font-medium mt-1">Rated {selected} ★</p>;
  }

  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={16}
          className={`cursor-pointer transition-colors ${
            star <= (hovered || selected) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleRate(star)}
        />
      ))}
    </div>
  );
}

function CustomerOrderCard({ data }) {
  const navigate = useNavigate();

  const customerStatusLabel = {
    pending: 'Order Placed',
    confirmed: 'Order Confirmed',
    preparing: 'Being Prepared',
    ready_for_pickup: 'Being Prepared',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
      {/* Order Header */}
      <div className="flex sm:justify-between border-b pb-3 flex-col sm:flex-row">
        <div className="flex items-start gap-2">
          <IoReceiptOutline className="text-xl text-gray-500 mt-1" />
          {/* order details */}
          <div>
            <p className="font-semibold text-gray-800">Order #{data?._id.slice(-7)}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <IoTimeOutline />
              {formatDateTime(data.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1 mt-4 sm:mt-0">
          <p className="text-sm">
            Payment:{' '}
            <span
              className={`font-medium px-2 py-1 rounded-full ${data.isPaid ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'}`}
            >
              {data.isPaid ? 'Paid' : 'Pending'}
            </span>
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start gap-1 text-sm font-medium text-gray-700">
        <IoLocationOutline className="text-lg shrink-0" />
        <p>{data?.deliveryAddress?.text}</p>
      </div>

      {/* Shop Orders */}
      {data?.shopOrders?.map((shopOrder) => {
        return (
          <div key={shopOrder._id} className="border rounded-xl p-4 bg-[#fffaf7] space-y-4">
            {/* Shop Name */}
            <p className="font-medium text-gray-800">{shopOrder.shop?.name || 'Shop'}</p>
            {/* Items */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {shopOrder?.shopOrderItems?.map((item) => {
                return (
                  <div key={item.item._id} className="shrink-0 w-40 border rounded-xl p-2 bg-white">
                    <img
                      src={item.item?.imageUrl}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <p className="text-sm font-medium mt-2 text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity} × ₹{item.price}
                    </p>
                    {/* rating */}
                    {shopOrder.status === 'delivered' && (
                      <StarRating
                        itemId={item.item?._id}
                        orderId={data._id}
                        existingRating={item.userRating}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Shop Footer */}
            <div className="flex sm:flex-row flex-col sm:justify-between border-t pt-3">
              <p className="font-semibold text-gray-800">Subtotal: ₹{shopOrder.subtotal}</p>

              <p className="text-sm mt-2 sm:mt-0">
                Status:{' '}
                <span
                  className={`font-medium ${
                    shopOrder.status === 'delivered'
                      ? 'text-green-600'
                      : shopOrder.status === 'out_for_delivery'
                        ? 'text-purple-600'
                        : shopOrder.status === 'preparing' ||
                            shopOrder.status === 'ready_for_pickup'
                          ? 'text-blue-600'
                          : shopOrder.status === 'confirmed'
                            ? 'text-orange-500'
                            : 'text-yellow-600'
                  }`}
                >
                  {customerStatusLabel[shopOrder.status] || 'Order Placed'}
                </span>
              </p>
            </div>
          </div>
        );
      })}

      {/* Order Footer */}
      <div className="flex flex-col sm:justify-between sm:flex-row sm:items-center border-t pt-3">
        <div>
          <p className="font-semibold text-gray-900">Total: ₹{data.totalAmount}</p>
          <p className="text-sm text-gray-700 my-1 sm:my-0">
            Delivery Charges: {data.deliveryCharge === 0 ? 'Free' : `₹${data.deliveryCharge}`}
          </p>
        </div>

        <button
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition mt-3 sm:mt-0 cursor-pointer"
          onClick={() => navigate(`/orders/${data._id}/track`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default CustomerOrderCard;
