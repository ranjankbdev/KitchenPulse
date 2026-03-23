import Navbar from './Navbar';
import HorizontalScroll from './HorizontalScroll';
import { FaUtensils } from 'react-icons/fa';
import { categories } from '../data/category.js';
import CategoryCard from './CategoryCard.jsx';

function UserDashboard() {
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
              className="md:w-[140px] md:h-[150px] cursor-pointer"
            />
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

export default UserDashboard;
