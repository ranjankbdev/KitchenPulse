import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import showToast from '../utils/toastHelper.js';
import { getShopByIdAPI } from '../services/shopService.js';
import { FaStar, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import HorizontalScroll from '../components/HorizontalScroll.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { FaLocationDot } from 'react-icons/fa6';
import { categories } from '../data/category.js';
import ItemCard from '../components/ItemCard.jsx';

function ShopPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  const handleShopData = async () => {
    try {
      const result = await getShopByIdAPI(shopId);
      setShop(result);
      setItems(result.items);
    } catch (error) {
      showToast('Failed to load shop data', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    handleShopData();
  }, [shopId]);

  useEffect(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);
  const availableCategories = [...new Set(items.map((item) => item.category))].filter(
    (c) => c !== 'others'
  );

  const visibleCategories = categories.filter((c) => {
    if (c.value === null) return true; // Always show "All"

    return availableCategories.includes(c.value);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-md transition cursor-pointer"
        onClick={() => navigate('/')}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{shop.name}</h1>
            <div className="block sm:flex sm:items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="font-medium">{shop.rating || 4.5}</span>
                <span className="text-gray-200">({shop.reviewCount || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot className="text-[#eb654d]" />
                <span className="text-gray-200">{shop.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 text-gray-600 text-sm">
        <Link to="/" className="hover:underline">
          Home
        </Link>{' '}
        &gt; {shop?.name}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-4">
          <FaUtensils className="text-[#ff4d2d]" /> Categories
        </h2>
        <div className="flex justify-start items-center">
          <HorizontalScroll>
            {visibleCategories.map((cate) => (
              <CategoryCard
                key={cate.name}
                name={cate.name}
                image={cate.image}
                className="max-w-50 sm:max-w-45 md:max-w-57 xl:max-w-51 h-50"
                onClick={() => setSelectedCategory(cate.value)}
                isActive={cate.value === selectedCategory}
              />
            ))}
          </HorizontalScroll>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {selectedCategory
            ? `${categories.find((c) => c.value === selectedCategory)?.name} Items`
            : 'All Items'}
        </h2>
        {filteredItems.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-start">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No items available</p>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
