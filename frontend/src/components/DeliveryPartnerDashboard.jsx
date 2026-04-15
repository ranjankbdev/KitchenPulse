import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import {
  getDeliveryAssignmentsAPI,
  acceptDeliveryAssignmentAPI,
  getActiveDeliveryAssignmentAPI,
  verifyDeliveryOtpAPI,
  sendDeliveryOtpAPI,
} from '../services/orderService.js';
import Navbar from './Navbar.jsx';
import showToast from '../utils/toastHelper.js';
import DeliveryTracking from './DeliveryTracking.jsx';

function DeliveryPartnerDashboard() {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [loading, setLoading] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');

  const getDeliveryAssignments = async () => {
    try {
      const result = await getDeliveryAssignmentsAPI();
      setAvailableAssignments(result);
    } catch (error) {
      showToast(error, 'error');
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
      const result = await verifyDeliveryOtpAPI(currentOrder._id, currentOrder.shopOrder._id, otp);
      setShowOtpBox(false);
      setOtp('');
      setCurrentOrder(null);
      showToast('Order Delivered Successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeliveryAssignments();
    getActiveDeliveryAssignment();
  }, [userData]);

  const totalQty =
    currentOrder?.shopOrder?.shopOrderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center p-2 sm:p-6">
        <div className="w-190 flex flex-col gap-5 items-center">
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2 mt-7">
            <h1 className="text-xl font-bold text-[#ff4d2d] capitalize">
              Welcome, {userData.fullName}
            </h1>
            <p className="text-green-600 font-semibold">📍 Location Active</p>
          </div>

          {!currentOrder && (
            <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
              <h1 className="text-lg font-bold mb-4 flex items-center gap-2">Available Orders</h1>

              <div className="space-y-4">
                {availableAssignments?.length > 0 ? (
                  availableAssignments.map((a) => {
                    const qty = a.items?.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <div
                        className="border rounded-lg p-4 flex justify-between items-center"
                        key={a?.assignmentId}
                      >
                        <div>
                          <p className="text-sm font-semibold">{a?.shopName}</p>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Delivery Address:</span>{' '}
                            {a?.deliveryAddress.text}
                          </p>
                          <p className="text-xs text-gray-400">
                            {qty} items • ₹{a.subtotal}
                          </p>
                        </div>
                        <button
                          className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
                          onClick={() => acceptDeliveryAssignment(a.assignmentId)}
                        >
                          Accept
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">No Available Orders</p>
                )}
              </div>
            </div>
          )}

          {currentOrder && (
            <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
              <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
              <div className="border rounded-lg p-4 mb-3">
                <p className="font-semibold text-sm">{currentOrder?.shopOrder?.shop?.name}</p>
                <p className="text-sm text-gray-500">{currentOrder?.deliveryAddress?.text}</p>
                <p className="text-xs text-gray-400">
                  {totalQty} items • ₹{currentOrder?.shopOrder?.subtotal}
                </p>
              </div>

              <DeliveryTracking data={currentOrder} />

              {!showOtpBox ? (
                <button
                  className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer"
                  disabled={loading}
                  onClick={sendDeliveryOtp}
                >
                  {loading ? <ClipLoader size={20} color="white" /> : 'Mark As Delivered'}
                </button>
              ) : (
                <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                  <p className="text-sm font-semibold mb-2">
                    Enter OTP sent to{' '}
                    <span className="text-orange-500 capitalize">{currentOrder.user.fullName}</span>
                  </p>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />

                  <button
                    className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer"
                    disabled={loading || !otp}
                    onClick={verifyDeliveryOtp}
                  >
                    {loading ? 'Verifying...' : 'Submit OTP'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryPartnerDashboard;
