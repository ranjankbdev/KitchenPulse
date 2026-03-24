import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseCartItem, decreaseCartItem } from '../redux/cartSlice';

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
  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = cartItems?.find((i) => i._id === data._id);
  const quantity = cartItem?.quantity || 0;

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

        {quantity === 0 ? (
          <button
            onClick={() => dispatch(addToCart(data))}
            className="bg-[#ff4d2d] text-white px-4 py-1.5 rounded-lg hover:bg-[#e04325] cursor-pointer"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              onClick={() => dispatch(decreaseCartItem(data._id))}
              className="px-2 py-2 hover:bg-gray-300 cursor-pointer"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-3">{quantity}</span>

            <button
              onClick={() => dispatch(increaseCartItem(data._id))}
              className="px-2 py-2 hover:bg-gray-300 cursor-pointer"
            >
              <FaPlus size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
