import { useEffect, useState } from 'react';
import { FaUtensils, FaStar } from 'react-icons/fa';
import { categories } from '../data/category.js';
import { BsShop } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getShopsByCityAPI } from '../services/shopService.js';
import { getItemsByCityAPI } from '../services/itemService.js';
import { setShopsInMyCity, setItemsInMyCity } from '../redux/userSlice.js';
import CategoryCard from './CategoryCard.jsx';
import Navbar from './Navbar';
import HorizontalScroll from './HorizontalScroll';
import showToast from '../utils/toastHelper.js';
import ItemCard from './ItemCard.jsx';
import useGetMyOrders from '../hooks/useMyOrders.jsx';

function UserDashboard() {
  const dispatch = useDispatch();
  useGetMyOrders();
  const { currentCity, shopsInMyCity, itemsInMyCity } = useSelector((state) => state.user);

  const [updatedItemsList, setUpdatedItemsList] = useState([]);

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

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

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
          Recommended for You
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-5 my-4 justify-center">
          {updatedItemsList?.length > 0 ? (
            updatedItemsList.map((item) => <ItemCard key={item._id} data={item} />)
          ) : (
            <div className="w-full text-center text-gray-500 mt-6">
              No food items available right now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
