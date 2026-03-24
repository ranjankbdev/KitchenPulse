import { useState } from 'react';
import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const renderStars = (rating = 0) =>
  Array.from({ length: 5 }).map((_, i) =>
    i < rating ? (
      <FaStar key={i} className="text-yellow-500 text-lg" />
    ) : (
      <FaRegStar key={i} className="text-yellow-500 text-lg" />
    )
  );

function ItemCard({ data }) {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.cart);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  const isInCart = cartItems.some((i) => i._id === data._id);

  const handleAddToCart = () => {
    if (!quantity) return;

    dispatch(
      addToCart({
        _id: data._id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        shop: data.shop,
        quantity,
        foodType: data.foodType,
      })
    );
  };

  return (
    <div className="w-full max-w-[340px] sm:max-w-[266px] md:max-w-[290px] lg:max-w-[270px] xl:max-w-[222px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[150px] sm:h-[170px] md:h-[190px] xl:h-[150px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType === 'veg' ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>

        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-2">
        <h1 className="font-semibold text-gray-900 text-base truncate">{data.name}</h1>

        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.ratings?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.ratings?.average || 0} ({data.ratings?.count || 0})
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-2">
        <span className="font-bold text-gray-900 text-lg">₹{data.price}</span>

        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button
            className="px-2 py-[10px] hover:bg-gray-300 transition text-gray-700 cursor-pointer"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>
          <span className="px-2 text-sm font-medium">{quantity}</span>
          <button
            className="px-2 py-2.5 hover:bg-gray-300 transition text-gray-700 cursor-pointer"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>
          <button
            disabled={!quantity}
            className={`${isInCart ? 'bg-gray-800 hover:bg-gray-900' : 'bg-[#ff4d2d] hover:bg-[#e04325]'} text-white px-3 py-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleAddToCart}
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
