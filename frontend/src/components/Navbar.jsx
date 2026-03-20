import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';
import { FaLocationDot } from 'react-icons/fa6';
import { TbReceipt2 } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { logoutUserAPI } from '../services/authService';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

function Tooltip({ text }) {
  return (
    <span
      className="absolute -bottom-9 left-1/2 -translate-x-1/2
      whitespace-nowrap bg-gray-800 text-white text-xs
      px-2 py-1 rounded opacity-0
      group-hover:opacity-100 transition-all duration-200
      pointer-events-none z-[9999]"
    >
      {text}
    </span>
  );
}

function Navbar() {
  const { userData, currentCity } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.vendor);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUserAPI();
      setShowDropdown(false);
      dispatch(setUserData(null));
      showToast('User logout successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isUser = userData?.role === 'user';
  const isVendor = userData?.role === 'vendor';
  const isDeliveryPartner = userData?.role === 'deliveryPartner';

  return (
    <>
      <div
        className={`w-full bg-white flex h-16 items-center
          ${isVendor ? 'justify-between md:justify-evenly' : ''}
          ${isUser ? 'justify-between xl:justify-evenly xl:px-60' : ''}
          gap-2 fixed top-0 z-[9999] px-3 md:px-6 shadow-sm border-b border-gray-100`}
      >
        {/* Left — Logo */}
        <div className="flex gap-1.5 items-center shrink-0">
          <img
            className="h-8 w-8 md:h-9 md:w-9 object-contain rounded-lg"
            src="/kitchenpulse_logo.png"
            alt="KitchenPulse Logo"
          />
          <h1 className="text-xl md:text-2xl font-bold leading-none">
            <span className="text-gray-900">Kitchen</span>
            <span className="text-[#ff4d2d]">Pulse</span>
          </h1>
        </div>

        {/* Middle — Search (lg+ = iPad and above) */}
        {isUser && (
          <div className="hidden md:flex flex-1 max-w-xl xl:max-w-5xl 2xl:max-w-7xl mx-4 xl:mx-12 2xl:mx-20">
            <div className="flex items-center w-full border border-gray-200 hover:border-[#ff4d2d]/40 focus-within:border-[#ff4d2d] focus-within:shadow-[0_0_0_3px_rgba(255,77,45,0.08)] px-4 py-2.5 rounded-full transition-all duration-200 bg-gray-50">
              {/* Location */}
              <div className="flex items-center gap-1.5 w-[32%] min-w-0">
                <FaLocationDot size={15} className="text-[#ff4d2d] shrink-0" />
                <span className="truncate text-sm font-medium text-gray-700">{currentCity}</span>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-400 mx-2" />
              {/* Search input */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <IoIosSearch size={18} className="text-[#ff4d2d] shrink-0" />
                <input
                  placeholder="Search your favorite food"
                  className="w-full focus:outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Right */}
        <div
          className={`flex items-center shrink-0 relative ${isUser ? 'gap-2' : ''} ${isVendor ? 'gap-3' : ''}`}
        >
          {/* Vendor actions */}
          {isVendor && (
            <>
              {myShopData && (
                <>
                  <button
                    type="button"
                    className="hidden md:flex items-center gap-1.5 cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1.5 rounded-lg hover:bg-[#ff4d2d]/20 text-sm font-medium transition-colors"
                  >
                    <FaPlus size={14} /> Add Food Item
                  </button>
                  <div className="relative group md:hidden">
                    <button className="flex items-center justify-center bg-[#ff4d2d]/10 text-[#ff4d2d] p-2 rounded-lg hover:bg-[#ff4d2d]/20 cursor-pointer transition-colors">
                      <FaPlus size={18} />
                    </button>
                    <Tooltip text="Add Food" />
                  </div>{' '}
                </>
              )}

              <button
                type="button"
                className="hidden md:flex items-center gap-1.5 cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1.5 rounded-lg hover:bg-[#ff4d2d]/20 text-sm font-medium transition-colors"
              >
                <TbReceipt2 size={16} />
                Shop Orders
                <span className="absolute top-[-5px] right-11 w-4 h-4 bg-[#ff4d2d] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                  1
                </span>
              </button>
              <div className="relative group md:hidden">
                <button className="flex items-center justify-center bg-[#ff4d2d]/10 text-[#ff4d2d] p-2 rounded-lg hover:bg-[#ff4d2d]/20 cursor-pointer transition-colors">
                  <TbReceipt2 size={18} />
                </button>
                <span className="absolute top-[-7px] right-[-5px] w-4 h-4 bg-[#ff4d2d] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                  1
                </span>
                <Tooltip text="Shop Orders" />
              </div>
            </>
          )}

          {/* User actions */}
          {isUser && (
            <div className="flex items-center gap-1">
              {/* Mobile search toggle */}
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="md:hidden flex items-center justify-center text-[#ff4d2d] p-2 rounded-lg hover:bg-[#ff4d2d]/10 cursor-pointer transition-colors"
              >
                {showSearch ? <IoClose size={22} /> : <IoIosSearch size={22} />}
              </button>

              {/* Cart */}
              <div className="relative group">
                <button
                  aria-label="Open cart"
                  type="button"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-[#ff4d2d]/10 cursor-pointer transition-colors"
                >
                  <FiShoppingCart size={22} className="text-[#ff4d2d]" />
                </button>
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#ff4d2d] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                  1
                </span>
                <Tooltip text="Cart" />
              </div>

              {/* My Orders — tablet+ */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer hover:bg-[#ff4d2d]/20 transition-colors whitespace-nowrap"
              >
                My Orders
              </button>
            </div>
          )}

          {/* Avatar + Dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <div className="group inline-block">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center
                  rounded-full bg-[#ff4d2d] hover:bg-[#e63f22]
                  text-white font-semibold text-sm cursor-pointer
                  transition-colors duration-200 select-none ring-2 ring-[#ff4d2d]/20"
              >
                {userData?.fullName.slice(0, 1)?.toUpperCase()}
              </button>
              {!showDropdown && <Tooltip text="Profile" />}
            </div>

            {showDropdown && (
              <div className="absolute top-11 right-0 w-44 bg-white shadow-xl border border-gray-100 rounded-xl py-1.5 flex flex-col items-center gap-1 z-[9999]">
                <button
                  type="button"
                  onClick={() => setShowDropdown(false)}
                  className="px-2 py-1.5 w-40 text-center rounded-lg cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 transition-colors"
                >
                  {userData?.fullName?.split(' ')[0]?.replace(/^./, (char) => char.toUpperCase())}
                </button>
                {isUser && (
                  <button
                    type="button"
                    onClick={() => setShowDropdown(false)}
                    className="lg:hidden px-2 py-1.5 w-40 text-center rounded-lg cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 transition-colors"
                  >
                    My Orders
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  type="button"
                  className="px-2 py-1.5 w-40 text-center rounded-lg cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && isUser && (
        <>
          <div className="lg:hidden fixed top-14 md:top-16 left-0 right-0 mx-3 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 flex items-center gap-2 z-[9998] mt-3">
            <div className="flex items-center gap-1.5 w-[47%] min-w-0">
              <FaLocationDot size={15} className="text-[#ff4d2d] shrink-0" />
              <span className="text-sm font-medium text-gray-700">{currentCity}</span>
            </div>
            <div className="h-6 w-px bg-gray-400 mx-2" />
            <IoIosSearch size={18} className="text-[#ff4d2d] shrink-0 ml-1" />
            <input
              type="text"
              autoFocus
              placeholder="Search your favorite food items"
              className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
