import { MdPhone, MdEmail } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

function VendorOrderCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
      {/* Customer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex">
          <FaUserCircle className="text-3xl text-gray-400" />
          <div className="ms-2 text-gray-500 text-sm">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {data?.user?.fullName}
            </h2>
            <p className="flex items-center gap-2">
              <MdEmail />
              {data?.user?.email}
            </p>
            <p className="flex items-center gap-2">
              <MdPhone />
              {data?.user?.mobileNumber}
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p className="font-medium text-gray-700 text-sm my-2">
            Payment:
            <span
              className={`rounded-full px-3 py-1 ms-1 ${
                data.isPaid ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-orange-100'
              }`}
            >
              {data.isPaid ? 'Paid' : 'Pending'}
            </span>
          </p>
          <p>Order ID: #{data?._id?.slice(-7)}</p>
          <p className="mt-1">Ordered on: {new Date(data?.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1 text-sm font-medium text-gray-700">
        <IoLocationOutline className="text-lg shrink-0" />
        <p>{data?.deliveryAddress?.text}</p>
      </div>

      {/* LOOP EACH SHOP ORDER */}
      {data?.shopOrders?.length > 0 &&
        data?.shopOrders?.map((shopOrder) => (
          <div key={shopOrder._id} className="pt-4 space-y-3">
            {/* Items */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {shopOrder?.shopOrderItems?.map((item) => (
                <div key={item._id} className="shrink-0 w-40 border rounded-xl p-2 bg-gray-50">
                  <img
                    src={item?.item?.imageUrl}
                    alt={item?.item?.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />

                  <p className="text-sm font-medium mt-2 text-gray-800">{item?.item?.name}</p>

                  <p className="text-xs text-gray-500">
                    Qty {item.quantity} × ₹{item.price}
                  </p>
                </div>
              ))}
            </div>
            <hr />
            {/* Status + Action */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="text-sm">
                Status:{' '}
                <span className="font-semibold capitalize text-orange-400">
                  {shopOrder?.status ? shopOrder.status.replaceAll('_', ' ') : 'N/A'}
                </span>
              </div>

              <select className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-[#ff4d2d] focus:outline-none w-50">
                <option value="">Update</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for delivery</option>
              </select>
            </div>

            {/* Total */}
            <div className="sm:text-right text-left font-semibold text-gray-800">
              Total: ₹{shopOrder?.subtotal}
            </div>
          </div>
        ))}
    </div>
  );
}

export default VendorOrderCard;
