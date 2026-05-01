import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';

function HorizontalScroll({ children }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth;

    if (!hasOverflow) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({ left: -250, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({ left: 250, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);

    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [children]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => checkScroll());
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full relative mt-4">
      {showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer"
        >
          <FaCircleChevronLeft />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="w-full flex overflow-x-auto gap-4 scrollbar-hide"
      >
        {children}
      </div>

      {showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer"
        >
          <FaCircleChevronRight />
        </button>
      )}
    </div>
  );
}

export default HorizontalScroll;
