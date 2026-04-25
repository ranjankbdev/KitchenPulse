import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { ClipLoader } from 'react-spinners';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { registerUserAPI, googleAuthAPI } from '../../services/authService.js';
import { auth } from '../../config/firebase.js';
import showToast from '../../utils/toastHelper.js';
import { setUserData } from '../../redux/userSlice.js';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const name = fullName.trim();
    const mail = email.trim();
    const mobile = mobileNumber.trim();
    const pass = password.trim();

    if (!name) return 'Please enter your full name';
    if (name.length < 4) return 'Full name must be at least 4 characters long';
    if (name.length > 50) return 'Full name cannot be longer than 50 characters';

    if (!mail) return 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return 'Please enter a valid email address';

    if (!mobile) return 'Please enter your mobile number';
    if (!/^[0-9]{10}$/.test(mobile)) return 'Mobile number must be exactly 10 digits';

    if (!pass) return 'Please enter a password';
    if (pass.length < 6) return 'Password must be at least 6 characters long';

    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    const error = validateForm();
    if (error) {
      showToast(error, 'error');
      return;
    }
    try {
      setLoading(true);
      const user = { fullName, email, password, mobileNumber, role };
      const data = await registerUserAPI(user);
      showToast('Account created successfully!', 'success');
      dispatch(setUserData(data));
      setFullName('');
      setEmail('');
      setMobileNumber('');
      setRole('user');
      setPassword('');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuthentication = async (e) => {
    const mobile = mobileNumber.trim();
    if (!mobile) {
      showToast('Please enter your mobile number', 'error');
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      showToast('Mobile number must be exactly 10 digits', 'error');
      return;
    }

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = {
        fullName: result.user.displayName,
        email: result.user.email,
        mobileNumber,
        role,
      };
      const data = await googleAuthAPI(user);
      showToast('Welcome! You are signed in', 'success');
      dispatch(setUserData(data));
      setMobileNumber('');
      setRole('user');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 pb-6 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-300">
        <h1 className="text-3xl font-bold mb-2 flex justify-center text-[#ff4d2d]">KitchenPulse</h1>
        <p className="text-gray-600 mb-8 flex justify-center items-center m-4">
          Join KitchenPulse today and experience fast, fresh, and delightful food delivered right to
          your door.
        </p>

        {/* form */}
        <form onSubmit={handleSignUp}>
          {/* fullName */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none border-gray-400"
              placeholder="Enter your Full Name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>

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
            />
          </div>

          {/* mobile*/}
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1">
              Mobile
            </label>
            <input
              id="mobile"
              type="tel"
              pattern="[0-9]{10}"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none border-gray-400"
              placeholder="Enter your Mobile Number"
              onChange={(e) => setMobileNumber(e.target.value)}
              value={mobileNumber}
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
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 cursor-pointer top-3.5 text-gray-500"
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* role*/}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
              Role
            </label>
            <div className="flex gap-2">
              {['user', 'vendor', 'deliveryPartner'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer ${role === r ? 'bg-[#ff4d2d] text-white border-none' : 'bg-white text-[#ff4d2d] border border-[#ff4d2d]'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
          >
            {loading ? <ClipLoader size={20} color="white" /> : 'Sign Up'}
          </button>
        </form>
        <button
          onClick={handleGoogleAuthentication}
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition cursor-pointer duration-200 border-gray-400 hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p className="text-center mt-6">
          Already have an account ?{' '}
          <span onClick={() => navigate('/signin')} className="text-[#ff4d2d] cursor-pointer">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
