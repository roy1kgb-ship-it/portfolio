import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootText = [
  "BIOS DATE 01/15/2024 14:22:54 VER 1.0.4",
  "CPU: ARMv8 64-bit Processor",
  "DETECTING PRIMARY MASTER ... ACE_WAHOME_CORE",
  "DETECTING PRIMARY SLAVE ... PORTFOLIO_DATA",
  "MEMORY TEST: 64438K OK",
  "Loading drivers ...",
  "Initialize GPU [WEBGL 2.0] ... OK",
  "Initialize AUDIO [DOLBY_ATMOS] ... SKIPPED",
  "Loading KERNEL ... OK",
  "Mounting VIRTUAL_FILE_SYSTEM ...",
  "Reading /etc/config/mechatronics.conf ...",
  " > ENABLE_MOTION_CONTROL = TRUE",
  " > ENABLE_HAPTICS = TRUE",
  "Establishing Uplink ... SUCCESS",
  "BOOT SEQUENCE COMPLETE.",
  "STARTING INTERFACE..."
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lineIndex = 0;
    
    const interval = setInterval(() => {
      if (lineIndex < bootText.length) {
        const text = bootText[lineIndex];
        // Only update if text exists
        if (text) {
            setLines(prev => [...prev, text]);
        }
        
        // Auto scroll
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 800);
        setTimeout(onComplete, 1500); // Allow exit animation
      }
    }, 150); // Speed of text

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once on mount

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black text-primary font-mono text-sm p-8 overflow-hidden cursor-wait"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="max-w-2xl mx-auto h-full flex flex-col justify-end pb-20 relative">
            
            {/* Retro CRT Effect Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            <div className="mb-8 border-b border-primary/30 pb-2 flex justify-between">
                <span>AMI V.2.40</span>
                <span>ENERGY STAR ALLY</span>
            </div>

            <div ref={containerRef} className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
                {lines.map((line, i) => (
                    <div key={i} className="flex">
                        <span className="mr-4 text-dim">{(i + 1).toString().padStart(2, '0')}</span>
                        {/* Added safe check for line existence before calling includes */}
                        <span className={line && line.includes("ERROR") ? "text-red-500" : "text-primary/90"}>
                            {line || ""}
                        </span>
                    </div>
                ))}
                <div className="animate-pulse">_</div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-dim border-t border-primary/30 pt-4">
                <div>DEL : Setup</div>
                <div>F11 : Boot Menu</div>
                <div>F12 : Network Boot</div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};