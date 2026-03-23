import Navbar from './Navbar';
import HorizontalScroll from './HorizontalScroll';
import { useEffect } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { categories } from '../data/category.js';
import CategoryCard from './CategoryCard.jsx';
import { BsShop } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import showToast from '../utils/toastHelper.js';
import { getShopsByCityAPI } from '../services/shopService.js';
import { setShopsInMyCity } from '../redux/userSlice.js';

function UserDashboard() {
  const dispatch = useDispatch();
  const { currentCity, shopsInMyCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const result = await getShopsByCityAPI(currentCity);
        console.log(result);
        dispatch(setShopsInMyCity(result));
      } catch (error) {
        showToast(error, 'error');
      }
    };
    if (currentCity) fetchShops();
  }, [currentCity]);

  return (
    <div>
      <Navbar />

      {/* category */}
      <div className="px-4 sm:px-10 md:px-20 xl:px-70 pt-[30px]">
        <h1 className="flex items-start gap-2 text-gray-800 text-2xl sm:text-3xl ">
          <FaUtensils className="text-[#ff4d2d]" />
          Explore by Category
        </h1>
        <HorizontalScroll>
          {categories.map((cate) => (
            <CategoryCard
              key={cate.category}
              name={cate.category}
              image={cate.image}
              className="w-[120px] h-[130px] md:w-[140px] md:h-[150px] cursor-pointer"
            />
          ))}
        </HorizontalScroll>

        {/* shop */}
        <h1 className="flex items-start gap-2 text-gray-800 text-2xl sm:text-3xl mt-11">
          <BsShop className="text-[#ff4d2d] " />
          Popular Restaurants in {currentCity}
        </h1>

        <HorizontalScroll>
          {shopsInMyCity?.map((shop) => (
            <CategoryCard
              key={shop._id}
              name={shop.name}
              image={shop.imageUrl}
              className="w-[140px] h-[150px] md:w-[160px] md:h-[170px] cursor-pointer"
            />
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

export default UserDashboard;
