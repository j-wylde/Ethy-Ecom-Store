
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-section h-[550px]">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/lovable-uploads/e7edabff-4014-4344-aea1-93cc89816d01.png" 
          alt="EnySkin Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">
          Your Skin Deserves The<br/>Best Care!
        </h1>
        <p className="max-w-2xl text-lg mb-8">
          Discover a better version of yourself with our products, crafted for
          perfection, our products blend luxury with functionality, enhancing
          your daily beauty routine.
        </p>
        <Link 
          to="/shop"
          className="coral-button flex items-center"
        >
          SHOP NOW 
          <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
