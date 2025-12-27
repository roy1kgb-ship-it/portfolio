import React, { useEffect, useState, useRef } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  speed?: number;
  triggerOnHover?: boolean;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&£€¥§©®±µ¶';

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  speed = 50,
  triggerOnHover = false
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const animate = () => {
    let iteration = 0;
    
    clearInterval(intervalRef.current as number);
    
    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(intervalRef.current as number);
      }
      
      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (!triggerOnHover) {
      animate();
    }
  }, [text]);

  useEffect(() => {
    if (triggerOnHover && isHovered) {
      animate();
    }
  }, [isHovered]);

  return (
    <span 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
};