import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { ClipLoader } from 'react-spinners';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { loginUserAPI, googleAuthAPI } from '../../services/authService.js';
import { auth } from '../../config/firebase.js';
import showToast from '../../utils/toastHelper';
import { setUserData } from '../../redux/userSlice.js';

const GUEST_EMAIL = import.meta.env.VITE_EMAIL_ID;

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const mail = email.trim();
    const pass = password.trim();
    if (!mail) return 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return 'Please enter a valid email address';
    if (!pass) return 'Please enter a password';
    if (pass.length < 6) return 'Password must be at least 6 characters long';

    return null;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;
    const error = validateForm();
    if (error) {
      showToast(error, 'error');
      return;
    }
    try {
      setLoading(true);
      const user = { email, password };
      const data = await loginUserAPI(user);
      dispatch(setUserData(data));
      showToast('Login successful!', 'success');
      setEmail('');
      setPassword('');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuthentication = async (e) => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const data = await googleAuthAPI({ email: result.user.email });
      dispatch(setUserData(data));
      showToast('Welcome! You are signed in', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center p-4 pb-6 bg-[#fff9f6]">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-300">
          <h1 className="text-3xl font-bold mb-2 flex justify-center text-[#ff4d2d]">
            KitchenPulse
          </h1>
          <p className="text-gray-600 mb-8 flex justify-center items-center m-4">
            Join KitchenPulse today and experience fast, fresh, and delightful food delivered right
            to your door.
          </p>

          {/* form */}
          <form onSubmit={handleSignIn}>
            {/* email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none border-gray-400"
                placeholder="Enter your Email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            {/* password*/}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none pr-10 border-gray-400"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 cursor-pointer top-3.5 text-gray-500"
                >
                  {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              <div className="flex justify-end ">
                <button
                  onClick={() => navigate('/forgot-password')}
                  type="button"
                  className="cursor-pointer me-1 hover:underline"
                >
                  Forgot Password ?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
            >
              {loading ? <ClipLoader size={20} color="white" /> : 'Sign In'}
            </button>
          </form>

          <button
            onClick={() => {
              setEmail(GUEST_EMAIL);
              setPassword('111111');
            }}
            type="button"
            className="mt-4 w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
          >
            Continue as Guest
          </button>

          <button
            onClick={handleGoogleAuthentication}
            type="button"
            className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition cursor-pointer duration-200 border-gray-400 hover:bg-gray-100"
          >
            <FcGoogle size={20} />
            <span>Sign In with Google</span>
          </button>
          <p className="text-center mt-6">
            Do not have an account ?{' '}
            <span onClick={() => navigate('/signup')} className="text-[#ff4d2d] cursor-pointer">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignIn;
