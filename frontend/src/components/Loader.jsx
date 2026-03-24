import React from 'react';

const Loader = ({ message = "Loading...", color = "teal" }) => {
  const colorClass = color === "yellow" ? "border-yellow-400" : 
                    color === "purple" ? "border-purple-500" : 
                    "border-teal-500";
  
  const textClass = color === "yellow" ? "text-yellow-400/80" : 
                   color === "purple" ? "text-purple-400/80" : 
                   "text-teal-400/80";

  return (
    <div className="flex flex-col justify-center items-center min-h-[40vh] gap-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-white/5 rounded-full"></div>
        <div className={`absolute top-0 left-0 w-12 h-12 border-4 ${colorClass} rounded-full border-t-transparent animate-spin`}></div>
      </div>
      {message && (
        <div className={`${textClass} font-bold tracking-widest text-[11px] capitalize animate-pulse`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Loader;
