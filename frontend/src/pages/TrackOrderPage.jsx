import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { getOrderByIdAPI } from '../services/orderService';
import DeliveryTracking from '../components/DeliveryTracking';

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();

  const getOrderById = async () => {
    try {
      const result = await getOrderByIdAPI(orderId);
      setCurrentOrder(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderById();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div
          className=" hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
          onClick={() => navigate('/orders')}
        >
          <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        </div>
        <h2 className="font-semibold text-xl sm:text-2xl text-gray-800">Track Your Order</h2>
      </div>
      {/* Loop through shop-wise orders inside main order */}
      {currentOrder?.shopOrders?.map((shopOrder) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
          key={shopOrder._id}
        >
          {/* Shop + order details */}
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">{shopOrder.shop.name}</p>
            <p className="font-semibold">
              <span>Items:</span> {shopOrder.shopOrderItems?.map((i) => i.name).join(',')}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> ₹{shopOrder.subtotal}
            </p>
            <p className="mt-6">
              <span className="font-semibold">Delivery address:</span>{' '}
              {currentOrder.deliveryAddress?.text}
            </p>
          </div>
          {/* Delivery status section */}
          {shopOrder.status != 'delivered' ? (
            <>
              {shopOrder.assignedDeliveryPartner ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    Delivery Partner Name:{' '}
                    <span className="capitalize">{shopOrder.assignedDeliveryPartner.fullName}</span>
                  </p>
                  <p className="font-semibold">
                    Delivery Partner Contact:{' '}
                    <span>{shopOrder.assignedDeliveryPartner.mobileNumber}</span>
                  </p>
                </div>
              ) : (
                <p className="font-semibold">Delivery Partner not assigned yet.</p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">✅ Delivered</p>
          )}

          {/* Live tracking map (only if delivery partner exists and not delivered) */}
          {shopOrder.assignedDeliveryPartner && shopOrder.status !== 'delivered' && (
            <div className="h-100 w-full rounded-2xl overflow-hidden shadow-md">
              <DeliveryTracking
                data={{
                  deliveryPartnerLocation: {
                    lat: shopOrder.assignedDeliveryPartner.currentLocation.coordinates[1],
                    lon: shopOrder.assignedDeliveryPartner.currentLocation.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrderPage;
