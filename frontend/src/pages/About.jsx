const About = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass p-8 sm:p-12 md:p-16 rounded-[2.5rem] text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">
          About Brightify
        </h1>
        <p className="text-xl text-gray-200 leading-relaxed mb-8">
          Welcome to Brightify, your destination for accessible premium lighting solutions. 
          We offer energy-efficient designs that blend minimalist style with modern technology 
          to brighten your home and outdoor spaces.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          Founded in 2025, our mission is to simplify luxury lighting. Every fixture in our 
          collection is selected for its performance, comfort, and design longevity, 
          ensuring your living space feels as good as it looks.
        </p>
      </div>
    </div>
  );
};

export default About;
