import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { FaBoxOpen } from 'react-icons/fa';
import {
  getDeliveryAssignmentsAPI,
  acceptDeliveryAssignmentAPI,
  getActiveDeliveryAssignmentAPI,
  verifyDeliveryOtpAPI,
  sendDeliveryOtpAPI,
  getEarningsAPI,
} from '../services/orderService.js';
import Navbar from './Navbar.jsx';
import showToast from '../utils/toastHelper.js';
import DeliveryTracking from './DeliveryTracking.jsx';

// helper to check if a date is today
const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// helper to check if a date is within last 7 days
const isThisWeek = (date) => {
  const d = new Date(date);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return d >= weekAgo;
};

function DeliveryPartnerDashboard() {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [loading, setLoading] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [earningsTab, setEarningsTab] = useState('today');

  const getDeliveryAssignments = async () => {
    try {
      const result = await getDeliveryAssignmentsAPI();
      setAvailableAssignments(result);
      console.log(result);
    } catch (error) {
      showToast('error', 'error');
    }
  };

  const acceptDeliveryAssignment = async (assignmentId) => {
    try {
      await acceptDeliveryAssignmentAPI(assignmentId);
      await getActiveDeliveryAssignment();
      showToast('Delivery assignment accepted successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const getActiveDeliveryAssignment = async () => {
    try {
      const result = await getActiveDeliveryAssignmentAPI();
      setCurrentOrder(result);
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const sendDeliveryOtp = async (e) => {
    try {
      setLoading(true);
      const result = await sendDeliveryOtpAPI(currentOrder._id, currentOrder.shopOrder._id);
      setShowOtpBox(true);
      showToast('OTP sent to customer', 'info');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

const verifyDeliveryOtp = async (e) => {
  try {
    setLoading(true);
    await verifyDeliveryOtpAPI(currentOrder._id, currentOrder.shopOrder._id, otp);
    await getDeliveryAssignments();
    await getEarnings();
    setCurrentOrder(null);
    setShowOtpBox(false);
    setOtp('');
    showToast('Order Delivered Successfully!', 'success');
  } catch (error) {
    showToast(error, 'error');
  } finally {
    setLoading(false);
  }
};

  // fetch earnings from backend
  const getEarnings = async () => {
    try {
      const result = await getEarningsAPI();
      setEarnings(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) return;

    getDeliveryAssignments();
    getActiveDeliveryAssignment();
    getEarnings();
  }, [userData]);

  // filter earnings based on selected tab
  const filteredEarnings = earnings.filter((e) => {
    if (earningsTab === 'today') return isToday(e.completedAt);
    if (earningsTab === 'week') return isThisWeek(e.completedAt);
    return true; // all time
  });

  // calculate totals for selected period
  const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.commission, 0);
  const totalDeliveries = filteredEarnings.length;

  const totalQty =
    currentOrder?.shopOrder?.shopOrderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center p-2 sm:p-6">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* ACTIVE ORDER SECTION */}
          {currentOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Active Delivery</h2>

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Order ID:</span> #{currentOrder._id?.slice(-7)}
                </p>
                <p>
                  <span className="font-medium">Shop:</span> {currentOrder.shopName}
                </p>
                <p>
                  <span className="font-medium">
                    Items: {totalQty} item(s) —{' '}
                    {currentOrder.shopOrder?.shopOrderItems?.map((i) => i.name).join(', ')}
                  </span>{' '}
                </p>
                <p>
                  <span className="font-medium">Delivery Address:</span>{' '}
                  {currentOrder.deliveryAddress?.text}
                </p>
              </div>

              {currentOrder.shopOrder && (
                <div className="h-60 w-full rounded-xl overflow-hidden">
                  <DeliveryTracking
                    data={{
                      deliveryPartnerLocation: {
                        lat: currentOrder.deliveryPartnerLocation?.lat,
                        lon: currentOrder.deliveryPartnerLocation?.lon,
                      },
                      customerLocation: {
                        lat: currentOrder.deliveryAddress?.latitude,
                        lon: currentOrder.deliveryAddress?.longitude,
                      },
                    }}
                  />
                </div>
              )}

              {!showOtpBox ? (
                <button
                  onClick={sendDeliveryOtp}
                  disabled={loading}
                  className="w-full bg-[#ff4d2d] text-white py-2.5 rounded-xl font-medium hover:bg-[#e64526] transition cursor-pointer flex justify-center"
                >
                  {loading ? <ClipLoader size={18} color="white" /> : 'Send Delivery OTP'}
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
                  />
                  <button
                    onClick={verifyDeliveryOtp}
                    disabled={loading}
                    className="w-30 bg-[#ff4d2d] text-white px-5 rounded-xl font-medium hover:bg-[#e64526] transition cursor-pointer flex items-center justify-center"
                  >
                    {loading ? <ClipLoader size={16} color="white" /> : 'Verify'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AVAILABLE ASSIGNMENTS SECTION */}
          {!currentOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Assignments</h2>

              {!availableAssignments ? (
                <div className="flex justify-center py-6">
                  <ClipLoader size={24} color="#ff4d2d" />
                </div>
              ) : availableAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                  <FaBoxOpen size={28} className="mb-2" />
                  <p className="text-sm">
                    No delivery requests right now. Please check again in a few minutes.
                  </p>
                </div>
              ) : (
                <div className='max-h-96 overflow-y-auto space-y-3 pr-1'>
                  {availableAssignments.map((assignment) => (
                    <div
                      key={assignment.assignmentId}
                      className="border border-gray-100 rounded-xl p-4 space-y-2 bg-[#fffaf7]"
                    >
                      <div className="sm:flex sm:justify-between">
                        <div className="">
                          <p className="font-medium text-gray-800">{assignment.shopName}</p>
                          <p className="text-sm text-gray-500">{assignment.shopAddress}</p>
                          <p className="text-sm text-gray-600">
                            Items: {assignment.items?.map((i) => i.name).join(', ')}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            Subtotal: ₹{assignment.subtotal}
                          </p>
                        </div>
                        <div className="mt-5 sm:mt-0">
                          <p className="font-medium text-gray-800">Delivery Address</p>
                          <p>{assignment.deliveryAddress?.text}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => acceptDeliveryAssignment(assignment.assignmentId)}
                        className="mt-1 w-full bg-[#ff4d2d] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e64526] transition cursor-pointer"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EARNINGS SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">My Earnings</h2>

            {/* Tab Buttons */}
            <div className="flex gap-2">
              {[
                { label: 'Today', value: 'today' },
                { label: 'This Week', value: 'week' },
                { label: 'All Time', value: 'all' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setEarningsTab(tab.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    earningsTab === tab.value
                      ? 'bg-[#ff4d2d] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="flex gap-3">
              <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#ff4d2d]">₹{totalEarnings}</p>
                <p className="text-xs text-gray-500 mt-1">Total Earned</p>
              </div>
              <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#ff4d2d]">{totalDeliveries}</p>
                <p className="text-xs text-gray-500 mt-1">Deliveries</p>
              </div>
            </div>

            {/* Earnings List */}
            {filteredEarnings.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No deliveries in this period.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {filteredEarnings.map((e) => (
                  <div
                    key={e.assignmentId}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 bg-[#fffaf7]"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.shopName}</p>
                      <p className="text-xs text-gray-400">
                        Order #{e.orderId?.toString().slice(-7)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(e.completedAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[#ff4d2d] font-bold text-base">+₹{e.commission}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryPartnerDashboard;
