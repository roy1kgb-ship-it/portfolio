import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootText = [
  "BIOS DATE 01/15/2024 14:22:54 VER 1.0.4",
  "CPU: ARMv8 64-bit Processor",
  "DETECTING PRIMARY MASTER ... ROY_WAHOME_CORE",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lineIndex = 0;
    
    const interval = setInterval(() => {
      if (lineIndex < bootText.length) {
        const text = bootText[lineIndex];
        // Only update if text exists
        if (text) {
            setLines(prev => [...prev, text]);
        }
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 800);
        setTimeout(onComplete, 1500); // Allow exit animation
      }
    }, 120); // Speed of text

    return () => clearInterval(interval);
  }, []); 

  // Auto scroll effect
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black text-primary font-mono text-sm overflow-hidden cursor-wait flex items-center justify-center"
          {...{ exit: { opacity: 0, scale: 1.1, filter: "blur(10px)" } } as any}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            {/* Retro CRT Effect Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20 z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-20" />

            {/* Container Box: Fixed size, contents scroll */}
            <div className="w-[90%] md:w-full max-w-2xl h-[60vh] border border-primary/20 bg-black/80 p-8 relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                
                <div className="mb-4 border-b border-primary/30 pb-2 flex justify-between shrink-0">
                    <span>AMI V.2.40</span>
                    <span>ENERGY STAR ALLY</span>
                </div>

                {/* Text Container: Fixed height, scrolls internally */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-start pr-2">
                    {lines.map((line, i) => (
                        <div key={i} className="flex shrink-0">
                            <span className="mr-4 text-dim select-none">{(i + 1).toString().padStart(2, '0')}</span>
                            <span className={line && line.includes("ERROR") ? "text-red-500" : "text-primary/90"}>
                                {line || ""}
                            </span>
                        </div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-dim border-t border-primary/30 pt-4 shrink-0">
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