import { FaMinus, FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

function CartItemCard({ item }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      {/* Item Info */}
      <div className="flex items-center gap-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <h1 className="font-medium text-gray-800">{item.name}</h1>
          <p className="text-sm text-gray-500">
            ₹{item.price} × {item.quantity}
          </p>
          <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
          <FaMinus size={12} />
        </button>
        <span className="font-medium">{item.quantity}</span>
        <button className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
          <FaPlus size={12} />
        </button>
        <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition cursor-pointer">
          <RiDeleteBin6Line size={18} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
