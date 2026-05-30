import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { uploadImage } from '../services/imageService.js';
import { setMyShopData } from '../redux/vendorSlice.js';
import { createItemAPI, getItemByIdAPI, updateItemAPI } from '../services/itemService.js';
import showToast from '../utils/toastHelper.js';
import useImagePicker from '../hooks/useImagePicker.js';
import { useRef } from 'react';

function ManageItem({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const [formLoading, setFormLoading] = useState(mode === 'edit');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [preview, setPreview] = useState(null);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');

  const imageInputRef = useRef(null);

  const { handleImageSelection } = useImagePicker(setPicture, setPreview);

  const categories = ['snacks', 'main_course', 'desserts', 'beverages', 'fast_food', 'others'];

  useEffect(() => {
    if (mode === 'edit' && itemId) {
      const handleGetItemById = async () => {
        try {
          setFormLoading(true);
          const item = await getItemByIdAPI(itemId);
          setName(item.name);
          setPrice(item.price?.toString() || '');
          setCategory(item.category);
          setFoodType(item.foodType);
          setPreview(item.imageUrl);
          setPicture(null);
          setDescription(item.description || '');
        } catch (error) {
          showToast('Failed to load item data!', 'error');
        } finally {
          setFormLoading(false);
        }
      };
      handleGetItemById();
    }
  }, [itemId, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validations = [
      { check: !name.trim(), message: 'Food name is required!' },
      {
        check: description.trim().length < 20,
        message: 'Description must be at least 20 characters!',
      },
      {
        check: !picture && !(mode === 'edit' ? preview : false),
        message: 'Food image is required!',
      },
      { check: !price || price <= 0, message: 'Price must be greater than 0!' },
      { check: !category, message: 'Category is required!' },
    ];
    const error = validations.find((v) => v.check);
    if (error) return showToast(error.message, 'error');

    try {
      setLoading(true);
      let imageUrl = preview;
      if (picture) {
        imageUrl = await uploadImage(picture);
      }

      const itemData = { name, description, price: Number(price), category, foodType, imageUrl };
      let response;
      if (mode === 'edit') {
        response = await updateItemAPI(itemId, itemData);
        showToast('Food Item updated successfully!', 'success');
      } else {
        response = await createItemAPI(itemData);
        showToast('Food Item added successfully!', 'success');
      }
      dispatch(setMyShopData(response));
      navigate('/');
    } catch (error) {
      showToast('Something went wrong!', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={70} color="#ff4d2d" cssOverride={{ borderWidth: '5px' }} />
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center p-6 relative min-h-screen bg-orange-50">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="relative flex items-center justify-center mb-6 w-full">
          <span
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 hover:bg-[#ff4d2d]/20 rounded cursor-pointer"
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </span>

          <div className="flex flex-col items-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <MdRestaurantMenu className="text-[#ff4d2d] w-16 h-16" />
            </div>

            <div className="text-[22px] font-bold text-gray-900 text-center">
              {mode === 'edit' ? 'Edit Menu Item' : 'Add New Menu Item'}
            </div>

            <p className="text-sm text-gray-500 text-center max-w-200">
              {mode === 'edit'
                ? 'Update the details of this food item to keep your menu up-to-date.'
                : 'Add a new dish to your restaurant menu so customers can explore it.'}
            </p>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
            <input
              type="text"
              placeholder="Enter Food Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              maxLength="120"
              placeholder="Short description (max 120 characters)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleImageSelection(e.target.files[0], imageInputRef)}
            />
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Food preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 capitalize"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="" hidden>
                Category
              </option>
              {categories.map((cate) => (
                <option value={cate} key={cate}>
                  {cate.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
            >
              <option value="veg">veg</option>
              <option value="non-veg">non veg</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          <button
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : mode === 'edit' ? (
              'Update Item'
            ) : (
              'Add Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageItem;
