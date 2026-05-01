import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { getOrderByIdAPI } from '../services/orderService';
import DeliveryTracking from '../components/DeliveryTracking';
import { formatDateTime } from '../utils/dateFormatter';
import socket from '../config/socket';

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();
  const [loading, setLoading] = useState(false);
  const [partnerLocation, setPartnerLocation] = useState(null);
  

  const getOrderById = async () => {
    try {
      setLoading(true);
      const result = await getOrderByIdAPI(orderId);
      setCurrentOrder(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderById();
  }, [orderId]);

  useEffect(() => {
    // listen for real-time location updates sent by delivery partner
    socket.on('partner_location_updated', ({ latitude, longitude }) => {
      setPartnerLocation({ lat: latitude, lon: longitude });
    });

    return () => socket.off('partner_location_updated');
  }, []);

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
      {loading ? (
        <div className="flex justify-center items-center fixed inset-0">
          <ClipLoader size={40} color="#ff4d2d" />
        </div>
      ) : (
        currentOrder?.shopOrders?.map((shopOrder) => (
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
                      <span className="capitalize">
                        {shopOrder.assignedDeliveryPartner.fullName}
                      </span>
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
              <>
                <p className="text-green-600 font-semibold text-lg">✅ Delivered</p>
                {shopOrder.deliveredAt && (
                  <p className="text-sm text-gray-500">
                    Delivered at: {formatDateTime(shopOrder.deliveredAt)}
                  </p>
                )}
              </>
            )}

            {/* Live tracking map (only if delivery partner exists and not delivered) */}
            {shopOrder.assignedDeliveryPartner && shopOrder.status !== 'delivered' && (
              <div className="w-full rounded-3xl overflow-hidden shadow-md">
                <DeliveryTracking
                  data={{
                    deliveryPartnerLocation: partnerLocation || {
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
        ))
      )}
    </div>
  );
}

export default TrackOrderPage;
