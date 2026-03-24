import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const whatsappNumber = "+919846974545";
  const whatsappMessage = "Hello Brightify Support, I need help with...";

  return (
    <div className="min-h-screen py-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 blur-[100px] rounded-full mt-10 ml-10 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full mb-10 mr-10 pointer-events-none"></div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 py-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-blue-300 tracking-tighter">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question or need assistance? Our specialist support team is ready to illuminate your experience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left mb-12 relative z-10">
            {/* Get in Touch Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 hover:border-teal-500/30 transition-all duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 text-lg">
                  <FaEnvelope />
                </span>
                Get in Touch
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-teal-400 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400/70 font-black mb-1">Email</p>
                    <p className="text-gray-200 font-bold truncate text-sm md:text-base underline underline-offset-4 decoration-teal-500/30">brightify.support@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="text-teal-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400/70 font-black mb-1">Phone</p>
                    <p className="text-gray-200 font-bold text-sm md:text-base">+91 98469 74545</p>
                    <p className="text-gray-200 font-bold text-sm md:text-base">+91 94956 33802</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <FaClock className="text-teal-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400/70 font-black mb-1">Support Hours</p>
                    <p className="text-gray-300 font-medium text-xs md:text-sm">Mon-Fri: 9am - 5pm EST</p>
                    <p className="text-teal-400 font-black text-xs md:text-sm mt-1">24/7 Priority Support Included</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Showroom Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 text-lg">
                  <FaMapMarkerAlt />
                </span>
                Showroom
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0" />
                  <div className="text-gray-200 font-medium leading-relaxed">
                    <p className="text-lg md:text-xl font-black text-white mb-1">Brightify Experience Center</p>
                    <p className="text-sm md:text-base">Pattambi, Palakkad</p>
                    <p className="text-sm md:text-base">Kerala, India - 679303</p>
                  </div>
                </div>
                
                <a 
                  href="https://maps.google.com/?q=Pattambi+Palakkad+Kerala" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-full bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-[10px] font-black tracking-widest transition-all duration-300 uppercase border border-blue-500/20"
                >
                  Get Directions →
                </a>
              </div>
            </motion.div>
          </div>

          {/* WhatsApp Primary Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-white/10 relative z-10"
          >
            <div className="flex flex-col items-center">
              <a 
                href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-3xl transition-all duration-500 shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:shadow-[0_30px_60px_rgba(37,211,102,0.6)] transform hover:-translate-y-2 active:scale-95"
              >
                <div className="absolute inset-x-0 -bottom-2 h-2 bg-black/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FaWhatsapp className="text-3xl md:text-5xl group-hover:rotate-[15deg] transition-transform duration-500" />
                <span className="tracking-tight">Need Help? Chat Now</span>
              </a>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Contact;

