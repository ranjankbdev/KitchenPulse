import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsShop } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { uploadImage } from '../services/imageService.js';
import { createShopAPI, updateShopAPI } from '../services/shopService.js';
import { setMyShopData } from '../redux/vendorSlice.js';
import showToast from '../utils/toastHelper.js';
import useImagePicker from '../hooks/useImagePicker.js';

function ManageShop({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myShopData } = useSelector((state) => state.vendor);
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [preview, setPreview] = useState('');
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleImageSelection } = useImagePicker(setPicture, setPreview);

  useEffect(() => {
    if (mode === 'edit' && myShopData) {
      setName(myShopData.name || '');
      setAddress(myShopData.address || '');
      setCity(myShopData.city || '');
      setState(myShopData.state || '');
      setPreview(myShopData.imageUrl || '');
    } else {
      setAddress(currentAddress || '');
      setCity(currentCity || '');
      setState(currentState || '');
    }
  }, [mode, myShopData, currentAddress, currentCity, currentState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validations = [
      { check: !name.trim(), message: 'Shop name is required!' },
      { check: !city.trim(), message: 'City is required!' },
      { check: !state.trim(), message: 'State is required!' },
      { check: !address.trim(), message: 'Address is required!' },
      {
        check: !picture && !(mode === 'edit' ? myShopData?.imageUrl : false),
        message: 'Shop image is required!',
      },
    ];
    const error = validations.find((v) => v.check);
    if (error) return showToast(error.message, 'error');

    try {
      setLoading(true);
      let imageUrl = mode === 'edit' ? myShopData?.imageUrl : null;
      if (picture) {
        imageUrl = await uploadImage(picture);
      }

      const shopData = { name, address, city, state, imageUrl };
      let response;
      if (mode === 'edit') {
        response = await updateShopAPI(shopData);
      } else {
        response = await createShopAPI(shopData);
      }
      dispatch(setMyShopData(response));
      showToast(
        mode === 'edit' ? 'Restaurant updated successfully!' : 'Restaurant created successfully!',
        'success'
      );
      navigate('/vendor');
    } catch (err) {
      console.error('Error submitting shop:', err);
      showToast('Something went wrong!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center py-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen px-2">
      <div
        className="absolute top-[35px] left-[20px] z-[10] mb-[10px] hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
        onClick={() => navigate('/')}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-2">
            <BsShop className="text-[#ff4d2d] w-10 h-10" />
          </div>

          <h2 className="text-[22px] font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Restaurant' : 'Create Restaurant'}
          </h2>

          <p className="text-sm text-gray-500 text-center">
            {mode === 'edit'
              ? 'Keep your restaurant info up to date.'
              : 'Showcase your restaurant to attract customers.'}
          </p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              onChange={(e) => handleImageSelection(e.target.files[0])}
            />
            {preview && (
              <div className="mt-4 relative">
                <img
                  alt="Shop Preview"
                  src={preview}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              autoComplete="street-address"
              type="text"
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                autoComplete="address-level2"
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                autoComplete="address-level1"
                type="text"
                placeholder="State"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                onChange={(e) => setState(e.target.value)}
                value={state}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : mode === 'edit' ? (
              'Update Restaurant'
            ) : (
              'Create Restaurant'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageShop;
