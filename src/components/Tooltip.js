import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('center');
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (tooltipRect.right > viewportWidth) {
        setPosition('right');
      } else if (tooltipRect.left < 0) {
        setPosition('left');
      } else {
        setPosition('center');
      }
    }
  }, [isVisible]);

  const getTooltipPositionClass = () => {
    switch (position) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };
  
  const getArrowPositionClass = () => {
    switch (position) {
      case 'left':
        return 'left-1/4 -translate-x-1/2';
      case 'right':
        return 'right-1/4 translate-x-1/2';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full mb-2 w-max max-w-xs px-3 py-2 bg-cool-gray-800 text-white text-sm rounded-md shadow-lg z-10 ${getTooltipPositionClass()}`}
          >
            {content}
            <div className={`absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-cool-gray-800 ${getArrowPositionClass()}`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;