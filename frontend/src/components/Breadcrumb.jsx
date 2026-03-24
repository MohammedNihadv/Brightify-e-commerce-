import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

/**
 * items: Array of objects { label: string, path: string }
 */
const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center text-sm font-medium text-gray-400 mb-6 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-sm w-fit animate-fade-in">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.6)] font-semibold">
                {item.label}
              </span>
            ) : (
              <>
                <Link to={item.path} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
                <FaChevronRight className="mx-3 text-gray-500 text-[10px]" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
