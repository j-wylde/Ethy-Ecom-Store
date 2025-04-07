


// const Hero = () => {
//   return (
//     <div className="hero-section h-[550px]">
//       <div className="absolute inset-0 overflow-hidden">
//         <img 
//           src="/lovable-uploads/e7edabff-4014-4344-aea1-93cc89816d01.png" 
//           alt="EnySkin Hero"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/30"></div>
//       </div>
      
//       <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
//         <h1 className="text-4xl md:text-6xl font-semibold mb-6">
//           Your Skin Deserves The<br/>Best Care!
//         </h1>
//         <p className="max-w-2xl text-lg mb-8">
//           Discover a better version of yourself with our products, crafted for
//           perfection, our products blend luxury with functionality, enhancing
//           your daily beauty routine.
//         </p>
//         <Link 
//           to="/shop"
//           className="coral-button flex items-center"
//         >
//           SHOP NOW 
//           <span className="ml-1">→</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

//export default Hero;

'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';

const images = [
  '/imgs/carousels/pexels-arina-krasnikova-6663584.jpg',
  '/imgs/carousels/pexels-misolo-cosmetic-2588316-11179580.jpg',
  "/imgs/carousels/pexels-gabby-k-6977468.jpg",
  '/imgs/carousels/pexels-roman-odintsov-10159288.jpg',
  '/imgs/carousels/pexels-ron-lach-9253776.jpg',
];

const Hero = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [current, setCurrent] = useState(0);
  const zoomRefs = useRef<HTMLDivElement[]>([]);

  const handleSelect = useCallback(() => {
    if (zoomRefs.current.length > 0) {
      zoomRefs.current.forEach((el, idx) => {
        el.classList.remove('animate-kenburns');
        if (idx === current) {
          el.classList.add('animate-kenburns');
        }
      });
    }
  }, [current]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleSelect();
  }, [current, handleSelect]);

  return (
    <div className="relative h-[550px] overflow-hidden">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((img, i) => (
            <div
              key={i}
              className="embla__slide relative min-w-full h-full"
            >
              <div
                ref={(el) => (zoomRefs.current[i] = el!)}
                className="absolute inset-0 bg-black/30 z-10"
              >
                <img
                  src={img}
                  alt={`slide-${i}`}
                  className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-[45px] md:text-7xl font-semibold mb-6 heading-title leading-none text-white md:leading-[5rem]">
          Your Skin Deserves The<br />Best Care!
        </h1>
        <p className="max-w-2xl text-[13px] md:text-base md:leading-6 font-normal mb-2 text-center text-white">
          Discover a better version of yourself with our products, crafted for
          perfection, our products blend luxury with functionality, enhancing
          your daily beauty routine.
        </p>
        <Link to="/shop" className="coral-button flex items-center">
          SHOP NOW <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
