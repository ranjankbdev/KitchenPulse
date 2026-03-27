import { FaPen } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/vendorSlice.js';
import { deleteItemByIdAPI } from '../services/itemService.js';
import showToast from '../utils/toastHelper.js';

function VendorItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const result = await deleteItemByIdAPI(`${data._id}`);
      dispatch(setMyShopData(result));
      showToast('Item deleted successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 w-full p-3 gap-4 items-center hover:shadow-lg transition">
      <div className="w-28 h-28 shrink-0">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{data.name}</h2>
        <p className="text-sm text-gray-500 capitalize">Category: {data.category}</p>
        <p className="text-sm text-gray-500 capitalize">Food Type: {data.foodType}</p>
        <p className="text-md font-semibold text-black">₹ {data.price}</p>
      </div>

      <div className="ml-auto flex items-center gap-3 text-[#ff4d2d]">
        <div
          className="p-2 rounded-full hover:bg-[#ff4d2d]/20 cursor-pointer"
          onClick={() => navigate(`/vendor/shop/items/${data._id}/edit`)}
        >
          <FaPen size={16} />
        </div>

        <div
          className="p-2 rounded-full hover:bg-[#ff4d2d]/20 cursor-pointer"
          onClick={handleDelete}
        >
          <FaTrashAlt size={16} />
        </div>
      </div>
    </div>
  );
}

export default VendorItemCard;
