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
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      <div className="w-36 flex-shrink-0 bg-gray-50">
        <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-[#ff4d2d] capitalize">{data.name}</h2>
          <p className="font-medium text-gray-700 capitalize">Category: {data.category}</p>
          <p className="font-medium text-gray-700 capitalize">Food Type: {data.foodType}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-bold">Price (₹): {data.price}</p>
          <div className="flex items-center gap-2">
            <div
              className="p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/30  text-[#ff4d2d]"
              onClick={() => navigate(`/vendor/shop/items/${data._id}/edit`)}
            >
              <FaPen size={16} />
            </div>
            <div
              className="p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/30  text-[#ff4d2d]"
              onClick={handleDelete}
            >
              <FaTrashAlt size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorItemCard;
