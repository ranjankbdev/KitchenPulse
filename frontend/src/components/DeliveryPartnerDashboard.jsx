import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getDeliveryAssignmentsAPI,
  acceptDeliveryAssignmentAPI,
  getActiveDeliveryAssignmentAPI,
} from '../services/orderService.js';
import Navbar from './Navbar.jsx';
import showToast from '../utils/toastHelper.js';

function DeliveryPartnerDashboard() {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [loading, setLoading] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);

  const getDeliveryAssignments = async () => {
    try {
      const result = await getDeliveryAssignmentsAPI();
      setAvailableAssignments(result);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptDeliveryAssignment = async (assignmentId) => {
    try {
      await acceptDeliveryAssignmentAPI(assignmentId);
      await getActiveDeliveryAssignment();
      showToast('Delivery assignment accepted successfully!', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  const getActiveDeliveryAssignment = async () => {
    try {
      const result = await getActiveDeliveryAssignmentAPI();
      setCurrentOrder(result);
    } catch (error) {
      console.log(error);
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryPartnerDashboard;
