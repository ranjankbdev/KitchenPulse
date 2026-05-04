function CategoryCard({ name, image, onClick, className = '', isActive = false }) {
  return (
    <button
      className={`${isActive ? 'border-4 border-[#ff4d2d]' : 'border-2 border-[#ff4d2d]'} rounded-2xl shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative ${className}`}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className=" w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute bottom-0 w-full left-0  bg-[#ffffff96] bg-opacity-95 px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur capitalize">
        {name}
      </div>
    </button>
  );
}

export default CategoryCard;
