import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import {
  sendPasswordResetOtpAPI,
  verifyPasswordResetOtpAPI,
  resetUserPasswordAPI,
} from '../../services/authService.js';
import showToast from '../../utils/toastHelper.js';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await sendPasswordResetOtpAPI({ email });
      showToast('OTP has been send to your registered Email!', 'info');
      setStep(2);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await verifyPasswordResetOtpAPI({ email, otp });
      showToast('OTP verified successfully!', 'success');
      setStep(3);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return showToast('Passwords do not match!', 'error');
    }
    try {
      setLoading(true);
      await resetUserPasswordAPI({ email, newPassword });
      showToast('Password reset successful!', 'success');
      navigate('/signin');
      setConfirmPassword('');
      setNewPassword('');
      setEmail('');
      setOtp('');
      setStep(1);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fff9f6] w-full">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <div className="flex gap-4 mb-4 items-center">
          <IoIosArrowRoundBack
            size={30}
            className="hover:text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate('/signin')}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {step == 1 && (
          <>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                required
                type="email"
                id="email"
                placeholder="Enter you Email"
                className="w-full border text-gray-700 border-gray-500 rounded-md focus:outline-none px-3 py-2"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white transition duration-200 rounded-lg font-semibold py-2"
            >
              {loading ? <ClipLoader size={20} color="white" /> : 'Send Otp'}
            </button>
          </>
        )}

        {step == 2 && (
          <>
            <div className="mb-6">
              <label htmlFor="otp" className="block mb-1 font-medium text-gray-700">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                className="w-full border text-gray-700 border-gray-500 rounded-md focus:outline-none px-3 py-2"
                placeholder="Enter OTP"
                required
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white transition duration-200 rounded-lg font-semibold py-2"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : 'Verify'}
            </button>
          </>
        )}

        {step == 3 && (
          <>
            <div className="mb-3">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full border text-gray-700 border-gray-500 rounded-md focus:outline-none px-3 py-2"
                placeholder="Enter new password"
                required
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="c-password" className="block mb-1 font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="c-password"
                type="password"
                className="w-full border text-gray-700 border-gray-500 rounded-md focus:outline-none px-3 py-2"
                placeholder="Confirm new password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button
              type="button"
              onClick={handleResetPassword}
              className="w-full bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white transition duration-200 rounded-lg font-semibold py-2"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : 'Change Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
