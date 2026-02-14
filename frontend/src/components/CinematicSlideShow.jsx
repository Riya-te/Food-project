import { useEffect, useRef, useState } from "react";

const CinematicSlideshow = ({
  images = [],
  interval = 2500, // calm & invisible
}) => {
  const [active, setActive] = useState(0); // 0 or 1
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  // preload images once
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const tick = () => {
      if (!pausedRef.current) {
        indexRef.current = (indexRef.current + 1) % images.length;
        setActive((prev) => (prev === 0 ? 1 : 0));
      }
      timerRef.current = setTimeout(tick, interval);
    };

    timerRef.current = setTimeout(tick, interval);
    return () => clearTimeout(timerRef.current);
  }, [images, interval]);

  if (!images.length) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-3xl"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* IMAGE A */}
      <img
        src={images[indexRef.current]}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover
                    ${active === 0 ? "block" : "hidden"}`}
        draggable={false}
      />

      {/* IMAGE B */}
      <img
        src={images[(indexRef.current + 1) % images.length]}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover
                    ${active === 1 ? "block" : "hidden"}`}
        draggable={false}
      />

      {/* constant soft depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-t
                      from-black/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default CinematicSlideshow;
