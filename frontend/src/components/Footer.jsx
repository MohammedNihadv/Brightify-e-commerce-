import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="glass mt-12 md:mt-24 mx-2 md:mx-4 mb-3 md:mb-6 p-6 md:p-12 text-center rounded-2xl md:rounded-3xl border-t border-white/10 min-h-[200px] flex items-center justify-center">
      <div className="flex flex-col justify-center items-center max-w-4xl mx-auto gap-3 md:gap-8">
        <div>
          <h2 className="text-sm md:text-xl font-bold tracking-tight text-white mb-2 md:mb-3">Brightify</h2>
          <p className="text-[10px] md:text-sm text-gray-300 mt-1 md:mt-2 font-medium">Affordable Lighting For Every Home</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-10 gap-y-1.5 md:gap-y-4 text-[11px] md:text-[15px] font-medium text-gray-200">
          <Link to="/about" className="hover:text-teal-300 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-teal-300 transition-colors">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-teal-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-teal-300 transition-colors">Terms of Service</Link>
        </div>
        
        <div className="w-full h-px bg-white/10 max-w-2xl mx-auto"></div>

        <div className="text-[10px] md:text-sm font-medium text-gray-300">
           &copy; {new Date().getFullYear()} Brightify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
