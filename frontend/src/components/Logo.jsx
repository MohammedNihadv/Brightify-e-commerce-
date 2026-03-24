import React from 'react';

const Logo = ({ className = "h-8 w-auto" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.3))' }}
    >
      <defs>
        {/* Main B Gradient */}
        <linearGradient id="b-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2c5364" />
          <stop offset="50%" stopColor="#203a43" />
          <stop offset="100%" stopColor="#0f2027" />
        </linearGradient>

        {/* Highlighting for the B edges */}
        <linearGradient id="b-border" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
        </linearGradient>

        {/* Glass Sphere Gradients */}
        <radialGradient id="sphere-base" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="70%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#134e4a" />
        </radialGradient>
        <radialGradient id="sphere-highlight" cx="35%" cy="35%" r="20%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The letter B Shape */}
      <path 
        d="M25 15H55C70 15 80 25 80 35C80 43 75 50 65 52C75 54 85 62 85 75C85 87 75 95 60 95H25V15Z" 
        fill="url(#b-gradient)" 
        stroke="url(#b-border)" 
        strokeWidth="1.5"
      />
      <path 
        d="M25 15V95M25 15H55C70 15 80 25 80 35C80 43 75 50 65 52M65 52C75 54 85 62 85 75C85 87 75 95 60 95H25" 
        stroke="white" 
        strokeOpacity="0.1" 
        strokeWidth="0.5"
      />

      {/* Inner cutouts for B */}
      <path d="M40 30H50C55 30 58 33 58 37C58 41 55 44 50 44H40V30Z" fill="#0f2027" />
      <path d="M40 65H55C60 65 63 68 63 72C63 76 60 79 55 79H40V65Z" fill="#0f2027" />

      {/* The Central Glass Sphere */}
      <circle cx="50" cy="50" r="18" fill="url(#sphere-base)" />
      <circle cx="50" cy="50" r="18" fill="url(#sphere-highlight)" />
      
      {/* Glossy Overlay */}
      <path 
        d="M38 42C40 38 45 35 50 35C55 35 60 38 62 42" 
        stroke="white" 
        strokeOpacity="0.4" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
