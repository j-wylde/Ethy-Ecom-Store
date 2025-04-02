
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, ArrowUp } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-coral rounded-full p-2">
                <Instagram size={20} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="bg-coral rounded-full p-2">
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="mb-2">Abuja, Nigeria.</p>
            <p className="mb-2">(+234)-807 834 7384</p>
            <p>info@enyskinco.com</p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-coral transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-coral transition-colors">Contact</Link></li>
              <li><Link to="/refund-policy" className="hover:text-coral transition-colors">Refund and Returns Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Subscribe To Newsletters</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="First Name"
                className="w-full px-4 py-2 rounded text-black"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2 rounded text-black"
              />
              <button className="w-full bg-coral hover:bg-coral-dark py-2 px-4 rounded transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8 z-10">
        <button 
          onClick={scrollToTop}
          className="bg-white rounded-full p-2 shadow-lg"
        >
          <ArrowUp size={24} className="text-black" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
