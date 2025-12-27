import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Motion values for instant tracking (Main Dot)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Spring values for trailing effect (Outer Ring)
  // High stiffness and low mass for a snappy, precise feel
  const springConfig = { damping: 20, stiffness: 400, mass: 0.1 };
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Direct assignment for 1:1 movement response
      dotX.set(e.clientX - 4); // Center the 8px dot
      dotY.set(e.clientY - 4);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer Ring - Follows with slight spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          width: 24, // Slightly larger than dot offset for centering
          height: 24,
          translateX: -8, // Adjust for size difference relative to dot position
          translateY: -8,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            borderColor: isHovering ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
          }}
          transition={{ duration: 0.15 }}
          className="w-full h-full border-[1.5px] border-white rounded-full"
        />
      </motion.div>

      {/* Center Dot - Instantly tracks mouse */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
        }}
      >
        <motion.div 
            animate={{ scale: isHovering ? 0.5 : 1 }}
            className="w-full h-full bg-primary rounded-full" 
        />
      </motion.div>
    </>
  );
};