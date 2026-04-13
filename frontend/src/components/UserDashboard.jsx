import { useEffect, useState } from 'react';
import { FaUtensils, FaStar } from 'react-icons/fa';
import { categories } from '../data/category.js';
import { BsShop } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getShopsByCityAPI } from '../services/shopService.js';
import { getItemsByCityAPI } from '../services/itemService.js';
import {
  setShopsInMyCity,
  setItemsInMyCity,
  setSearchQuery,
  setSearchItems,
} from '../redux/userSlice.js';
import CategoryCard from './CategoryCard.jsx';
import Navbar from './Navbar';
import HorizontalScroll from './HorizontalScroll';
import showToast from '../utils/toastHelper.js';
import ItemCard from './ItemCard.jsx';
import useGetMyOrders from '../hooks/useMyOrders.jsx';

function UserDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useGetMyOrders();
  const { currentCity, shopsInMyCity, itemsInMyCity, searchQuery, searchItems } = useSelector(
    (state) => state.user
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!currentCity) return;

    const fetchData = async () => {
      try {
        const [shops, items] = await Promise.all([
          getShopsByCityAPI(currentCity),
          getItemsByCityAPI(currentCity),
        ]);

        dispatch(setShopsInMyCity(shops));
        dispatch(setItemsInMyCity(items));
      } catch (error) {
        showToast(error, 'error');
      }
    };

    fetchData();
  }, [currentCity]);

  const handleCategoryClick = async (value) => {
    setSelectedCategory(value);
    dispatch(setSearchQuery(''));
    dispatch(setSearchItems([]));
  };

  const baseItems = (searchQuery?.trim() ? searchItems : itemsInMyCity) || [];
  const itemsToShow = baseItems.filter((item) =>
    selectedCategory ? item.category === selectedCategory : true
  );

  const isSearching = searchQuery?.trim()?.length > 0;

  return (
    <div>
      <Navbar />

      {/* category */}
      <div className="px-4 sm:px-10 md:px-20 xl:px-70 pt-8">
        <h1 className="flex items-start gap-2 text-gray-800 text-2xl sm:text-3xl ">
          <FaUtensils className="text-[#ff4d2d]" />
          Explore by Category
        </h1>
        <HorizontalScroll>
          {categories.map((cate) => (
            <CategoryCard
              key={cate.name}
              name={cate.name}
              image={cate.image}
              className="w-37 h-37 md:w-40 md:h-40 cursor-pointer"
              onClick={() => handleCategoryClick(cate.value)}
            />
          ))}
        </HorizontalScroll>

        {/* shop */}
        <h1 className="flex items-start gap-2 text-gray-800 text-2xl sm:text-3xl mt-11">
          <BsShop className="text-[#ff4d2d] " />
          Popular Restaurants in {currentCity}
        </h1>
        <HorizontalScroll>
          {shopsInMyCity?.length > 0 ? (
            shopsInMyCity.map((shop) => (
              <CategoryCard
                key={shop._id}
                name={shop.name}
                image={shop.imageUrl}
                className="max-w-67 sm:max-w-57 md:max-w-63 lg:max-w-60 xl:max-w-52 cursor-pointer"
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))
          ) : (
            <div className="ms-1 flex items-start gap-2 text-gray-500 text-lg mt-6">
              <BsShop className="text-[#ff4d2d] text-xl" />
              <span>No restaurants available in {currentCity}. Try another location.</span>
            </div>
          )}
        </HorizontalScroll>

        {/* items */}
        <h1 className="flex items-start gap-2 text-gray-800 text-2xl sm:text-3xl  mt-11">
          <FaStar className="text-[#ff4d2d]" />
          {isSearching
            ? `Search Results for "${searchQuery}"`
            : selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items`
              : 'Recommended for You'}
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-5 my-4 justify-center">
          {itemsToShow?.length > 0 ? (
            itemsToShow.map((item) => <ItemCard key={item._id} data={item} />)
          ) : (
            <div className="w-full max-w-md p-6 bg-gray-50 rounded-2xl shadow-sm text-center mt-6">
              <FaStar className="text-gray-300 text-4xl mx-auto mb-2" />
              <p className="text-gray-500 text-lg">
                {selectedCategory
                  ? `No items found in "${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}" category`
                  : 'No search results found'}
              </p>
              <p className="text-gray-400 mt-1">
                {selectedCategory
                  ? 'Try another category.'
                  : 'Try a different keyword or category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
