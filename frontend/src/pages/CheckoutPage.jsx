import { FaLocationDot } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaLock } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { TbCurrentLocation } from 'react-icons/tb';
import { MdDeliveryDining } from 'react-icons/md';
import { FaCreditCard } from 'react-icons/fa';
import { FaMobileScreenButton } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { createOrderAPI, verifyPaymentAPI } from '../services/orderService';
import { addMyOrder } from '../redux/orderSlice.js';
import { setCurrentLat, setCurrentLon } from '../redux/userSlice.js';
import {
  getLocationFromCoordinates,
  getCoordinatesFromLocation,
} from '../services/locationService';
import 'leaflet/dist/leaflet.css';
import showToast from '../utils/toastHelper.js';

function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 16, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

function ConfirmOrderModal({ address, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Delivery Location</h2>

        <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-3">
          <FaLocationDot className="text-[#ff4d2d] mt-1 shrink-0" />
          <p className="text-sm text-gray-700">
            {address ? `${address.slice(0, 80)}...` : 'No address selected'}
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Please confirm your delivery address is correct before placing the order.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Change
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !address}
            className="flex-1 bg-[#ff4d2d] hover:bg-[#e64526] text-white py-2 rounded-xl font-medium transition cursor-pointer flex items-center justify-center"
          >
            {loading ? <ClipLoader size={18} color="white" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentLat, currentLon, currentAddress } = useSelector((state) => state.user);
  const { cartItems, totalAmount } = useSelector((state) => state.cart);

  const [addressInput, setAddressInput] = useState(currentAddress || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentAddress && !addressInput) {
      setAddressInput(currentAddress);
    }
  }, [currentAddress]);

  const deliveryFee = Object.values(
    cartItems.reduce((acc, item) => {
      const shopId = item.shop;
      acc[shopId] = (acc[shopId] || 0) + item.price * item.quantity;
      return acc;
    }, {})
  ).reduce((sum, shopSubtotal) => sum + (shopSubtotal >= 500 ? 0 : 40), 0);

  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setCurrentLat(lat));
    dispatch(setCurrentLon(lng));
    updateAddressFromCoordinates(lat, lng);
  };

  const fetchCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setCurrentLat(latitude));
        dispatch(setCurrentLon(longitude));
        updateAddressFromCoordinates(latitude, longitude);
      },
      (error) => console.warn('Geolocation error:', error)
    );
  };

  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const locationData = await getLocationFromCoordinates(lat, lng);
      if (!locationData) return;
      setAddressInput(locationData.address);
    } catch (error) {
      console.log('GeoLocation error:', error);
    }
  };

  const handleSearchCoordinates = async () => {
    if (!addressInput) return;
    try {
      const coords = await getCoordinatesFromLocation(addressInput);
      if (!coords) return;
      const { lat, lon } = coords;
      dispatch(setCurrentLat(lat));
      dispatch(setCurrentLon(lon));
    } catch (error) {
      console.log('Forward geocoding error:', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        cartItems,
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: currentLat,
          longitude: currentLon,
        },
      };
      const result = await createOrderAPI(orderData);
      if (paymentMethod === 'cod') {
        dispatch(addMyOrder(result));
        showToast('Order placed successfully', 'success');
        navigate('/order/confirmation');
        return;
      }

      const options = {
        order_id: result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
        key: result.key,

        name: 'KitchenPulse',
        description: 'Food Order Payment',
        image:
          'https://res.cloudinary.com/dwv10qvzj/image/upload/v1776161248/kitchenpulse_logo_trotlz.png',

        handler: async function (response) {
          try {
            const verifyData = await verifyPaymentAPI({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: result.orderId,
            });

            dispatch(addMyOrder(verifyData));
            showToast('Payment successful!', 'success');
            navigate('/order/confirmation');
          } catch (error) {
            showToast('Payment verification failed', 'error');
          }
        },

        theme: {
          color: '#ff4d2d',
        },

        modal: {
          ondismiss: function () {
            showToast('Payment cancelled', 'error');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="bg-[#fff9f6] w-full min-h-screen flex justify-center items-center p-4 sm:p-6">
      {showModal && (
        <ConfirmOrderModal
          address={addressInput}
          onConfirm={handleCreateOrder}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}

      <div className="p-5 sm:p-6 rounded-2xl w-full max-w-200 shadow-xl bg-white space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          <h2 className="font-semibold text-xl sm:text-2xl text-gray-800">Confirm Your Order</h2>
        </div>

        {/* Delivery Location */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FaLocationDot size={20} className="text-[#ff4d2d]" />
            <p className="font-medium text-gray-800">Delivery Location</p>
          </div>

          <div className="flex gap-2">
            <input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter your delivery address"
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
            />

            <button
              onClick={handleSearchCoordinates}
              type="button"
              className="flex items-center gap-1 bg-[#ff4d2d] px-3 py-2 rounded-lg text-white text-sm hover:bg-[#e64526] transition cursor-pointer"
            >
              <IoSearchOutline size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={fetchCurrentLocation}
              type="button"
              className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500 px-3 py-2 rounded-lg text-white text-sm cursor-pointer"
            >
              <TbCurrentLocation size={18} />
              <span className="hidden sm:inline">Current</span>
            </button>
          </div>

          {currentLat && currentLon ? (
            <div className="rounded-xl overflow-hidden border h-57 relative z-0">
              <MapContainer center={[currentLat, currentLon]} zoom={21} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap lat={currentLat} lon={currentLon} />
                <Marker
                  position={[currentLat, currentLon]}
                  draggable
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                />
              </MapContainer>
            </div>
          ) : (
            <div className="rounded-xl border h-57 flex items-center justify-center text-gray-400 text-sm">
              Use current location or search to show map
            </div>
          )}
        </section>

        {/* Payment Method */}
        <section>
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Payment Method</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${
                paymentMethod === 'cod'
                  ? 'border-[#ff4d2d] bg-orange-50 shadow'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('cod')}
            >
              <div className="bg-orange-100 p-2 rounded-full">
                <MdDeliveryDining className="text-green-600 text-xl" size={22} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your food arrives</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${
                paymentMethod === 'online'
                  ? 'border-[#ff4d2d] bg-orange-50 shadow'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('online')}
            >
              <div className="flex gap-1">
                <div className="bg-gray-100 p-2 rounded-full">
                  <FaMobileScreenButton className="text-purple-700 text-lg" size={18} />
                </div>
                <div className="bg-gray-100 p-2 rounded-full">
                  <FaCreditCard className="text-blue-700 text-lg" size={18} />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">UPI / Credit / Debit</p>
                <p className="text-xs text-gray-500">Pay securely online</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Order Summary</h2>

          <div className="rounded-xl border bg-gray-50 p-4 space-y-2 text-sm">
            {cartItems?.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-gray-700">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="border-gray-300 my-2" />

            <div className="flex justify-between text-gray-800 font-medium">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-medium">
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total</span>
              <span>₹{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <button
          onClick={() => {
            if (!currentLat || !currentLon) {
              return showToast('Please select delivery location', 'error');
            }
            setShowModal(true);
          }}
          type="button"
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold transition cursor-pointer flex items-center justify-center gap-2"
        >
          {paymentMethod === 'cod' ? (
            <>
              <MdOutlineShoppingCartCheckout />
              <span>Confirm Order • ₹{amountWithDeliveryFee}</span>
            </>
          ) : (
            <>
              <FaLock />
              <span>Proceed to Payment • ₹{amountWithDeliveryFee}</span>
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-1">
          {paymentMethod === 'cod'
            ? 'Pay when your order is delivered'
            : 'Secure online payment powered by trusted gateways'}
        </p>
      </div>
    </div>
  );
}

export default CheckoutPage;
