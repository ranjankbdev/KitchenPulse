import { FaLocationDot } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaLock } from 'react-icons/fa';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { TbCurrentLocation } from 'react-icons/tb';
import { MdDeliveryDining } from 'react-icons/md';
import { FaCreditCard } from 'react-icons/fa';
import { FaMobileScreenButton } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { setLocation } from '../redux/locationSlice';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { setAddress } from '../redux/locationSlice';
import 'leaflet/dist/leaflet.css';
import {
  getLocationFromCoordinates,
  getCoordinatesFromLocation,
} from '../services/locationService';

// Re-centers the map whenever location changes
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location.lat && location.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);
  return null;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { location, address } = useSelector((state) => state.location);
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  console.log(cartItems);
  const [addressInput, setAddressInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;
  console.log(amountWithDeliveryFee);

  // Updates location and address when marker is dragged
  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ latitude: lat, longitude: lng }));
    updateAddressFromCoordinates(lat, lng);
  };

  // Fetches user's current geolocation
  const fetchCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ latitude, longitude }));
        updateAddressFromCoordinates(latitude, longitude);
      },
      (error) => console.warn('Geolocation error:', error)
    );
  };

  // Converts coordinates to address
  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const locationData = await getLocationFromCoordinates(lat, lng);
      if (!locationData) return;
      dispatch(setAddress(locationData.address));
      setAddressInput(locationData.address);
    } catch (error) {
      console.log('GeoLocation error:', error);
    }
  };

  // Converts address text to coordinates
  const handleSearchCoordinates = async () => {
    if (!addressInput) return;
    try {
      const coords = await getCoordinatesFromLocation(addressInput);
      if (!coords) return;
      const { lat, lon } = coords;
      dispatch(setLocation({ latitude: lat, longitude: lon }));
    } catch (error) {
      console.log('Forward geocoding error:', error);
    }
  };

  // Syncs Redux address
  useEffect(() => {
    if (address) setAddressInput(address);
  }, [address]);

  return (
    <div className="bg-[#fff9f6] w-full min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="p-5 sm:p-6 rounded-2xl w-full max-w-200 shadow-xl bg-white space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className=" hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
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

          {/* Map Placeholder */}
          {location.lat && location.lon ? (
            <div className="rounded-xl overflow-hidden border h-57">
              <MapContainer
                center={[location.lat, location.lon]}
                zoom={21}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location.lat, location.lon]}
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
            {/* COD */}
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

            {/* Online */}
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
              <span>{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-medium">
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total</span>
              <span>{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <button
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
