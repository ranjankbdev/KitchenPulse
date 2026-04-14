import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseCartItem, decreaseCartItem } from '../redux/cartSlice';

// render rating stars
const renderStars = (rating = 0) =>
  Array.from({ length: 5 }).map((_, i) =>
    i < rating ? (
      <FaStar key={i} className="text-yellow-500 text-base" />
    ) : (
      <FaRegStar key={i} className="text-yellow-500 text-base" />
    )
  );

function ItemCard({
  data,
  className = '',
  imageHeightClass = '',
  showActions = true,
  showDescription = true,
  shopName = null,
  onClick,
}) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = cartItems?.find((i) => i._id === data._id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col ${className}`}
    >
      {/* image */}
      <div
        className={`relative w-full flex justify-center items-center bg-white ${imageHeightClass}`}
      >
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm">
          {data.foodType === 'veg' ? (
            <FaLeaf className="text-green-600 text-base" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-base" />
          )}
        </div>

        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-semibold text-gray-900 text-base truncate">{data.name}</h1>

          {!showActions && (
            <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
              ₹{data.price}
            </span>
          )}
        </div>

        {shopName && <p className="text-xs text-gray-400 mt-0.5">{shopName}</p>}

        {/* description */}
        {showDescription && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            Freshly prepared with rich flavors and quality ingredients.
          </p>
        )}

        {/* rating */}
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.ratings?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.ratings?.average || 0} ({data.ratings?.count || 0})
          </span>
        </div>
      </div>

      {/* actions */}
      {showActions && (
        <div className="flex items-center justify-between mt-auto p-3 h-15">
          <span className="font-semibold text-gray-900 text-base">₹{data.price}</span>

          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart(data));
              }}
              className="bg-[#ff4d2d] text-white px-4 py-1.5 rounded-lg hover:bg-[#e04325] transition cursor-pointer"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(decreaseCartItem(data._id));
                }}
                className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <FaMinus size={12} />
              </button>

              <span className="px-3">{quantity}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(increaseCartItem(data._id));
                }}
                className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <FaPlus size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemCard;
