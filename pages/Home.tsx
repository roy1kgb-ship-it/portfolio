import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Cpu, Activity, Globe, Zap, Layers, Binary, Database, Terminal, Code2, RefreshCw, MapPin, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- DECORATIVE UI COMPONENTS ---

const TechCrosshair = ({ className }: { className?: string }) => (
  <div className={`absolute flex items-center justify-center opacity-30 ${className}`}>
    <div className="w-[1px] h-4 bg-primary/50" />
    <div className="w-4 h-[1px] bg-primary/50 absolute" />
  </div>
);

const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Major Grid - extremely subtle */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
    
    <TechCrosshair className="top-24 left-6 md:left-20" />
    <TechCrosshair className="top-24 right-6 md:right-20" />
    <TechCrosshair className="bottom-20 left-6 md:left-20" />
    <TechCrosshair className="bottom-20 right-6 md:right-20" />
  </div>
);

// --- ROBOTIC ARM KINEMATICS VISUALIZER ---

const RoboticArmTerminal = () => {
    // Arm Configuration
    const L1 = 30;
    const L2 = 25;
    const BaseX = 50;
    const BaseY = 80;

    // State
    const [target, setTarget] = useState({ x: 50, y: 30 });
    const [currentEE, setCurrentEE] = useState({ x: 50, y: 30 }); // Current End Effector
    const [status, setStatus] = useState("IDLE");

    // Inverse Kinematics Solver (2-Link Planar)
    const solveIK = useCallback((x: number, y: number) => {
        // Translate to local coords relative to base
        const dx = x - BaseX;
        const dy = BaseY - y; // Invert Y for calculation (Up is positive)

        const dist = Math.sqrt(dx*dx + dy*dy);
        const clampedDist = Math.min(dist, L1 + L2 - 0.1); // Prevent full extension singularity

        // Law of Cosines
        const alpha = Math.acos((L1*L1 + clampedDist*clampedDist - L2*L2) / (2*L1*clampedDist));
        const beta = Math.atan2(dy, dx);
        
        const theta1 = beta + alpha; // Shoulder angle
        
        const gamma = Math.acos((L1*L1 + L2*L2 - clampedDist*clampedDist) / (2*L1*L2));
        const theta2 = gamma - Math.PI; // Elbow angle relative to L1

        // Forward Kinematics for drawing joints
        const j1x = BaseX + L1 * Math.cos(theta1);
        const j1y = BaseY - L1 * Math.sin(theta1);
        
        const j2x = j1x + L2 * Math.cos(theta1 + theta2);
        const j2y = j1y - L2 * Math.sin(theta1 + theta2);

        return { j1: { x: j1x, y: j1y }, j2: { x: j2x, y: j2y }, theta1, theta2 };
    }, []);

    // Animation Loop
    useEffect(() => {
        let animationFrame: number;
        let lastTime = performance.now();
        
        const animate = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            setCurrentEE(prev => {
                const speed = 20; // Units per second
                const dx = target.x - prev.x;
                const dy = target.y - prev.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < 0.5) {
                    // Reached target
                    if (status !== "HOLDING") {
                        setStatus("HOLDING");
                        setTimeout(() => {
                            // Pick new random target in workspace
                            const angle = Math.PI/4 + Math.random() * (Math.PI/2); // 45 to 135 deg
                            const radius = 20 + Math.random() * 30;
                            const nx = BaseX + radius * Math.cos(angle); // Simple semi-circle area
                            const ny = BaseY - radius * Math.sin(angle); 
                            
                            // Constrain to canvas
                            const safeX = Math.max(10, Math.min(90, nx));
                            const safeY = Math.max(10, Math.min(70, ny));

                            setTarget({ x: safeX, y: safeY });
                            setStatus("MOVING");
                        }, 1000);
                    }
                    return prev;
                }

                const moveX = (dx / dist) * speed * dt;
                const moveY = (dy / dist) * speed * dt;
                
                return { x: prev.x + moveX, y: prev.y + moveY };
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [target, status]);

    // Calculate current joint positions
    const { j1, j2, theta1, theta2 } = solveIK(currentEE.x, currentEE.y);
    const { j1: tJ1, j2: tJ2 } = solveIK(target.x, target.y); // Target shadow

    return (
    <div className="w-full bg-[#09090b] border-y md:border border-white/10 md:rounded-xl rounded-none overflow-hidden shadow-2xl font-mono text-xs relative group mx-auto flex flex-col h-full z-20">
      
      {/* Header Bar */}
      <div className="bg-[#111] px-4 md:px-6 py-3 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px] ${status === 'MOVING' ? 'bg-secondary shadow-secondary/50' : 'bg-green-500 shadow-green-500/50'}`} />
                <span className={`text-[11px] font-bold tracking-wider ${status === 'MOVING' ? 'text-secondary' : 'text-green-500'}`}>
                    {status === 'MOVING' ? 'SERVO_ACTUATION' : 'TARGET_LOCKED'}
                </span>
            </div>
            <span className="text-gray-600 hidden sm:inline-block">IK_SOLVER_V2.1</span>
        </div>
        <div className="flex gap-6 text-[11px] text-gray-500">
            <span className="flex items-center gap-2"><RefreshCw size={12} className={status === 'MOVING' ? 'animate-spin' : ''} /> <span>AUTO_CYCLE</span></span>
            <span>MEM: 64KB</span>
        </div>
      </div>
      
      {/* Main Content Split */}
      <div className="flex flex-col md:grid md:grid-cols-12 grow h-auto min-h-[400px]">
        
        {/* Left Pane: Code */}
        <div className="md:col-span-7 bg-[#0c0c0c] p-0 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden flex flex-col">
             
             {/* Code Viewer */}
             <div className="p-4 md:p-6 grow overflow-hidden flex flex-col">
                 <div className="text-[10px] text-dim mb-4 border-b border-white/5 pb-2 flex justify-between shrink-0">
                    <span className="text-primary/70 flex items-center gap-2"><Code2 size={10} /> src/motion/kinematics.cpp</span>
                    <span>READ_ONLY</span>
                 </div>
                 <div className="flex gap-4 text-[11px] md:text-[13px] leading-relaxed font-mono overflow-x-auto h-full">
                    <div className="flex flex-col text-dim select-none text-right min-w-[20px] opacity-50">
                       {Array.from({length: 12}).map((_, i) => <div key={i}>{i + 84}</div>)}
                    </div>
                    <div className="text-gray-400 font-medium whitespace-pre">
                        <div><span className="text-gray-500">// Solve Inverse Kinematics for 2-Link Planar</span></div>
                        <div><span className="text-purple-400">void</span> <span className="text-blue-400">solveIK</span>(<span className="text-yellow-500">float</span> x, <span className="text-yellow-500">float</span> y) {'{'}</div>
                        <div>  <span className="text-gray-500">// Calculate Distance to Target</span></div>
                        <div>  <span className="text-yellow-500">float</span> D = (x*x + y*y - L1*L1 - L2*L2) / (2*L1*L2);</div>
                        <br/>
                        <div>  <span className="text-gray-500">// Elbow Angle (Law of Cosines)</span></div>
                        <div>  theta2 = <span className="text-blue-400">atan2</span>(<span className="text-blue-400">sqrt</span>(1-D*D), D);</div>
                        <br/>
                        <div>  <span className="text-gray-500">// Shoulder Angle</span></div>
                        <div>  theta1 = <span className="text-blue-400">atan2</span>(y, x) - </div>
                        <div>           <span className="text-blue-400">atan2</span>(L2*<span className="text-blue-400">sin</span>(theta2), L1+L2*<span className="text-blue-400">cos</span>(theta2));</div>
                        <div>{'}'}</div>
                    </div>
                 </div>
             </div>
             
             {/* Telemetry Footer */}
             <div className="bg-[#151515] p-4 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div>
                     <div className="text-[10px] text-dim mb-1">JOINT_01 (SHOULDER)</div>
                     <div className="text-primary font-mono">{(theta1 * 180 / Math.PI).toFixed(2)}°</div>
                     <div className="w-full bg-white/10 h-1 mt-1 rounded-full"><div className="h-full bg-primary" style={{ width: `${Math.abs(theta1/Math.PI*100)}%` }} /></div>
                 </div>
                 <div>
                     <div className="text-[10px] text-dim mb-1">JOINT_02 (ELBOW)</div>
                     <div className="text-secondary font-mono">{(theta2 * 180 / Math.PI).toFixed(2)}°</div>
                     <div className="w-full bg-white/10 h-1 mt-1 rounded-full"><div className="h-full bg-secondary" style={{ width: `${Math.abs(theta2/Math.PI*100)}%` }} /></div>
                 </div>
             </div>
        </div>

        {/* Right Pane: Visualization */}
        <div className="md:col-span-5 bg-[#09090b] flex flex-col relative h-[300px] md:h-auto overflow-hidden">
            <div className="absolute top-3 left-3 text-[10px] text-dim flex items-center gap-2 z-20">
                <Activity size={10} /> WORKSPACE_VISUALIZER
            </div>
            
            <div className="w-full h-full relative z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Workspace Bounds (Semi-circle approx) */}
                    <path d="M 10 80 Q 50 10 90 80" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    
                    {/* Base */}
                    <rect x={BaseX-5} y={BaseY} width="10" height="4" fill="#333" />
                    <circle cx={BaseX} cy={BaseY} r="2" fill="#555" />

                    {/* Target Ghost (Where it's going) */}
                    {status === 'MOVING' && (
                        <g opacity="0.3">
                            <line x1={BaseX} y1={BaseY} x2={tJ1.x} y2={tJ1.y} stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                            <line x1={tJ1.x} y1={tJ1.y} x2={tJ2.x} y2={tJ2.y} stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                            <circle cx={tJ1.x} cy={tJ1.y} r="1.5" fill="white" />
                            <circle cx={tJ2.x} cy={tJ2.y} r="1.5" fill="white" />
                        </g>
                    )}

                    {/* Active Arm Links */}
                    <motion.line 
                        x1={BaseX} y1={BaseY} x2={j1.x} y2={j1.y} 
                        stroke="#444" strokeWidth="3" 
                    />
                    <motion.line 
                        x1={j1.x} y1={j1.y} x2={j2.x} y2={j2.y} 
                        stroke="#444" strokeWidth="3" 
                    />
                    
                    {/* Wireframe Overlay */}
                    <line x1={BaseX} y1={BaseY} x2={j1.x} y2={j1.y} stroke="#00F0FF" strokeWidth="1" />
                    <line x1={j1.x} y1={j1.y} x2={j2.x} y2={j2.y} stroke="#00F0FF" strokeWidth="1" />

                    {/* Joints */}
                    <circle cx={j1.x} cy={j1.y} r="2" fill="#09090b" stroke="#00F0FF" strokeWidth="1.5" />
                    <circle cx={j2.x} cy={j2.y} r="2" fill="#09090b" stroke="#FF4D00" strokeWidth="1.5" />

                    {/* End Effector Target Marker */}
                    <g transform={`translate(${target.x}, ${target.y})`}>
                        <line x1="-3" y1="0" x2="3" y2="0" stroke="#FF4D00" strokeWidth="1" />
                        <line x1="0" y1="-3" x2="0" y2="3" stroke="#FF4D00" strokeWidth="1" />
                        <circle r="5" stroke="#FF4D00" strokeWidth="0.5" fill="none" opacity="0.5" />
                    </g>

                </svg>

                {/* Overlay Data */}
                <div className="absolute bottom-4 right-4 text-right bg-black/50 p-2 rounded backdrop-blur-sm border border-white/5">
                    <div className="text-[9px] text-gray-500 mb-1">END_EFFECTOR_POS</div>
                    <div className="text-xs font-mono text-white flex gap-3">
                        <span>X: {currentEE.x.toFixed(1)}</span>
                        <span>Y: {Math.abs(currentEE.y - 100).toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    );
};

// --- REUSABLE STACKED CAROUSEL ---

interface StackedItem {
    title: string;
    sub: string;
    icon: React.ReactNode;
    desc: string;
    color: string;
    bg: string;
}

const StackedCardCarousel = ({ items }: { items: StackedItem[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [items.length, isPaused]);

    return (
        <div 
            className="relative h-[320px] w-full flex items-center justify-center my-4 select-none"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full max-w-[320px] h-[220px]">
                <AnimatePresence>
                    {items.map((item, index) => {
                        const offset = (index - activeIndex + items.length) % items.length;
                        // Only render top 3 for performance/visuals
                        if (offset > 2) return null;

                        return (
                            <motion.div
                                key={item.title}
                                className={`absolute inset-0 rounded-2xl p-6 border bg-[#0a0a0a] backdrop-blur-xl flex flex-col justify-between shadow-2xl ${item.color} ${offset === 0 ? item.bg : 'bg-[#0a0a0a]'}`}
                                initial={false}
                                animate={{
                                    scale: offset === 0 ? 1 : offset === 1 ? 0.95 : 0.9,
                                    y: offset === 0 ? 0 : offset === 1 ? -15 : -30,
                                    zIndex: items.length - offset,
                                    opacity: offset < 3 ? 1 : 0,
                                }}
                                exit={{
                                    y: -100, // Lift up
                                    opacity: 0,
                                    scale: 1.05,
                                    zIndex: 50,
                                    transition: { duration: 0.5, ease: "easeInOut" }
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded bg-black border border-white/10 text-white">
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-mono text-dim">
                                        {offset === 0 && isPaused ? "PAUSED" : `0${index + 1}`}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-display font-bold text-white mb-2">{item.title}</h3>
                                    <div className="text-[10px] font-mono text-gray-400 mb-2">{item.sub}</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                
                                {/* Timer Bar (Only on active card) */}
                                <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                    {offset === 0 && (
                                        <motion.div 
                                            className="h-full bg-white/20" 
                                            initial={{ width: "0%" }}
                                            animate={{ width: isPaused ? "100%" : "100%" }}
                                            transition={{ duration: isPaused ? 0 : 4, ease: "linear", repeat: isPaused ? 0 : 0 }}
                                            key={activeIndex} 
                                        />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            
            {/* Hint for interaction */}
            <div className="absolute -bottom-10 text-[10px] font-mono text-dim animate-pulse">
                LONG PRESS TO INSPECT
            </div>
        </div>
    )
}

const Marquee = ({ text }: { text: string }) => {
    return (
        <div className="relative flex overflow-hidden py-4 border-y border-white/5 bg-black/50 backdrop-blur-sm z-20">
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10 pointer-events-none" />
            
            <motion.div 
                className="flex whitespace-nowrap text-6xl md:text-8xl font-display font-bold text-white/40 select-none"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            >
                {[0, 1].map((i) => (
                    <div key={i} className="flex shrink-0 items-center">
                        <span className="mx-8">{text}</span>
                        <span className="mx-8 text-stroke-primary">{text}</span>
                        <span className="mx-8">{text}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// --- DATA CONSTANTS ---

const featuresData: StackedItem[] = [
    { 
        title: "REAL-TIME CONTROL", 
        sub: "RTOS & SCHEDULING", 
        icon: <Zap size={20} />, 
        desc: "1kHz+ control loops for precise actuator management. Deterministic task scheduling using FreeRTOS on STM32.",
        color: "border-secondary/50",
        bg: "bg-secondary/5"
    },
    { 
        title: "SENSOR FUSION", 
        sub: "ESTIMATION ALGORITHMS", 
        icon: <Layers size={20} />, 
        desc: "Kalman filtering and Madgwick filters to combine accelerometer and gyroscope data for drift-free orientation.",
        color: "border-primary/50",
        bg: "bg-primary/5"
    },
    { 
        title: "EMBEDDED LOGIC", 
        sub: "BARE METAL C++", 
        icon: <Binary size={20} />, 
        desc: "Optimized C++ firmware running on bare-metal ARM architectures. Direct register manipulation for max speed.",
        color: "border-green-500/50",
        bg: "bg-green-500/5"
    }
];

const protocolsData: StackedItem[] = [
    { title: 'MECHANICAL', sub: 'CAD & KINEMATICS', icon: <Settings size={20} />, desc: 'DFMA-driven mechanical design using Fusion 360 and SolidWorks. Topology optimization.', color: 'border-secondary/50', bg: 'bg-secondary/5' },
    { title: 'ELECTRONICS', sub: 'PCB & CIRCUITS', icon: <Cpu size={20} />, desc: 'Custom PCB fabrication, power distribution, and mixed-signal circuit design (KiCad/Altium).', color: 'border-primary/50', bg: 'bg-primary/5' },
    { title: 'INTELLIGENCE', sub: 'FIRMWARE & ROS', icon: <Terminal size={20} />, desc: 'Robust firmware in C++/Python. PID, LQR, and MPC implementation on STM32/ESP32.', color: 'border-green-500/50', bg: 'bg-green-500/5' }
];

// --- MAIN COMPONENT ---

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
        
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <BlueprintGrid />
      
      {/* HUD OVERLAY - Moved to right to avoid overlap with 'ACE' text */}
      <div className="absolute top-32 right-6 md:right-12 z-40 pointer-events-none hidden md:block text-right">
          <div className="flex flex-col gap-1 p-2 bg-black/20 backdrop-blur-md border border-white/5 rounded-sm items-end">
              <span className="text-[10px] font-mono text-dim">COORDS</span>
              <span className="text-xs font-mono text-primary">01.2921° S, 36.8219° E</span>
          </div>
      </div>

      {/* --- HERO SECTION --- */}
      {/* UPDATED PADDING: pt-48 to ensure content isn't covered by mobile browser UI */}
      {/* ADDED BG AND BLUR TO REDUCE 3D NOISE */}
      <div className="w-full flex flex-col justify-center px-6 md:px-20 relative pt-48 md:pt-48 pb-24 bg-black/5 backdrop-blur-sm border-b border-white/5">
          <motion.div 
            style={{ y: yHero }}
            className="max-w-7xl w-full z-10 relative mx-auto grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Left Status Column */}
            <div className="hidden md:flex flex-col justify-between col-span-1 border-l border-white/10 pl-4 h-[50vh]">
                <div className="space-y-4">
                     <div className="text-[10px] font-mono text-dim rotate-180" style={{ writingMode: 'vertical-rl' }}>SYSTEM_READY</div>
                     <div className="w-px h-16 bg-primary/50 mx-auto" />
                </div>
                <div className="space-y-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-white/10 rounded-full" />
                    <div className="w-2 h-2 bg-white/10 rounded-full" />
                </div>
            </div>

            <div className="col-span-1 md:col-span-11">
                {/* Intro Tag */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100px' }}
                    transition={{ duration: 1, ease: 'circOut' }}
                    className="h-[1px] bg-primary mb-6 relative"
                >
                    <span className="absolute -top-5 left-0 text-[10px] font-mono text-primary">SYS.INIT_COMPLETE</span>
                </motion.div>

                {/* Main Title */}
                <div className="relative mb-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Adjusted text size for mobile compatibility */}
                        <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-display font-bold tracking-tighter text-white leading-[0.85]">
                            ACE
                            <br />
                            <span 
                                className="ml-0 md:ml-12 text-white/5 transition-colors duration-500 hover:text-white/20"
                                style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.5)' }}
                            >
                                WAHOME
                            </span>
                            <span className="text-primary">.</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Role & Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-6 border-t border-white/10">
                    <div className="max-w-xl">
                        {/* Static Text - Glitch Removed */}
                        <motion.h2 
                            className="text-xl md:text-2xl font-mono text-secondary mb-4 flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="tracking-widest">MECHATRONICS ENGINEERING STUDENT</span>
                        </motion.h2>
                        
                        {/* Location */}
                         <motion.div 
                            className="text-xs font-mono text-dim mb-4 flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
                             <MapPin size={12} /> NAIROBI, KE
                        </motion.div>

                        <motion.p 
                            className="text-gray-300 font-sans text-lg leading-relaxed shadow-black drop-shadow-sm border-l-2 border-white/10 pl-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            I design and build the nervous systems of machines. From mechanical CAD to embedded firmware, bridging the physical and digital worlds.
                        </motion.p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link to="/projects">
                                <button className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold font-mono text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2 clip-path-slant">
                                    VIEW_BLUEPRINTS <ChevronRight size={14} />
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button className="w-full sm:w-auto px-6 py-3 border border-white/20 text-white font-bold font-mono text-sm hover:bg-white/5 transition-colors">
                                    CONTACT_ME
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid grid-cols-2 gap-4 w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="bg-black/40 border border-white/10 p-4 md:p-6 backdrop-blur-sm group hover:border-primary/50 transition-colors">
                            <Cpu className="text-dim mb-2 group-hover:text-primary transition-colors" size={20} />
                            <div className="text-2xl md:text-3xl font-display font-bold text-white">4+</div>
                            <div className="text-[10px] font-mono text-gray-500">YEARS EXP</div>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-4 md:p-6 backdrop-blur-sm group hover:border-secondary/50 transition-colors">
                            <Globe className="text-dim mb-2 group-hover:text-secondary transition-colors" size={20} />
                            <div className="text-2xl md:text-3xl font-display font-bold text-white">12+</div>
                            <div className="text-[10px] font-mono text-gray-500">PROJECTS</div>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-4 md:p-6 backdrop-blur-sm group hover:border-green-500/50 transition-colors">
                            <Activity className="text-dim mb-2 group-hover:text-green-500 transition-colors" size={20} />
                            <div className="text-2xl md:text-3xl font-display font-bold text-white">98%</div>
                            <div className="text-[10px] font-mono text-gray-500">UPTIME</div>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-4 md:p-6 backdrop-blur-sm">
                            <Database className="text-dim mb-2" size={20} />
                            <div className="text-2xl md:text-3xl font-display font-bold text-white">100%</div>
                            <div className="text-[10px] font-mono text-gray-500">DEPLOYED</div>
                        </div>
                    </motion.div>
                </div>
            </div>
          </motion.div>
      </div>

      {/* ... rest of the file ... */}
      {/* --- SCROLLING MARQUEE --- */}
      <div className="relative z-20 transform -rotate-1 origin-center mb-8 mt-0">
         <Marquee text="ROBOTICS // FIRMWARE // AUTOMATION // PCB DESIGN //" />
      </div>

      {/* --- TERMINAL / WORKSTATION SECTION --- */}
      <section className="relative w-full py-10 px-0 md:px-20 min-h-[70vh] flex items-center justify-center">
        {/* Background Schematic Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
             <div className="w-[800px] h-[800px] border border-white rounded-full flex items-center justify-center animate-[spin_100s_linear_infinite]">
                <div className="w-[600px] h-[600px] border border-dashed border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white/20" />
                <div className="absolute top-1/2 left-1/2 h-full w-[1px] bg-white/20" />
             </div>
        </div>

        <div className="flex flex-col items-center max-w-7xl mx-auto w-full z-10 gap-8 px-4 md:px-0">
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-mono tracking-widest mb-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                     SYSTEM_ARCHITECTURE
                </div>
                
                <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight">
                    CODE THAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">MOVES MATTER</span>
                </h2>
                
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                    Modern engineering isn't just about assembling parts or writing scripts in isolation. It's about the <span className="text-white font-bold">symbiosis</span> of mechanical precision and algorithmic intelligence.
                </p>
            </motion.div>

            {/* Terminal Window - Full width on Mobile */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-[90vw] lg:w-full perspective-1000"
            >
                <RoboticArmTerminal />
            </motion.div>
            
            {/* Feature Highlights - Stacked Carousel on Mobile, Grid on Desktop */}
            <div className="w-full">
                {/* Mobile View */}
                <div className="block md:hidden">
                    <StackedCardCarousel items={featuresData} />
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {featuresData.map((item, index) => (
                        <div key={index} className="flex flex-col gap-3 p-6 bg-white/5 border border-white/5 rounded-xl hover:border-primary/50 transition-colors group">
                            <div className={`p-3 bg-black border border-white/10 w-fit rounded-lg group-hover:scale-110 transition-transform ${item.color.replace('border-', 'text-').replace('/50', '')}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-white font-bold font-mono text-lg">{item.title}</h3>
                            <p className="text-sm text-dim group-hover:text-gray-400 transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </section>

      {/* --- CORE PROTOCOLS (Cards) SECTION --- */}
      <section className="relative w-full py-10 md:py-16 px-6 md:px-20 bg-black/40 border-y border-white/5 backdrop-blur-sm">
        <TechCrosshair className="top-0 left-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6 text-center md:text-left">
                <div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">CORE PROTOCOLS</h2>
                    <div className="h-1 w-20 bg-primary mx-auto md:mx-0" />
                </div>
                <div className="font-mono text-xs text-dim text-right max-w-xs bg-black/50 p-4 border border-white/5 rounded hidden md:block">
                    // MODULES LOADED: 3<br/>
                    // STATUS: OPERATIONAL<br/>
                    // CLICK TO EXPAND DETAILS
                </div>
            </div>

            {/* MOBILE: STACKED CARD ANIMATION */}
            <div className="block md:hidden">
                <StackedCardCarousel items={protocolsData} />
            </div>

            {/* DESKTOP: GRID LAYOUT */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
                {protocolsData.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className={`bg-[#0a0a0a] border border-white/10 p-0 group relative overflow-hidden transition-all duration-300 ${item.color} hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                    >
                        {/* Industrial Header Plate */}
                        <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                            <div className={`p-2 bg-black border border-white/10 ${item.color.replace('border-','text-').replace('/50','')} rounded-sm`}>
                                {item.icon}
                            </div>
                            <div className="text-[10px] font-mono text-dim flex flex-col items-end">
                                <span>MOD_0{i+1}</span>
                                <span className="text-white/30">REV. A</span>
                            </div>
                        </div>

                        <div className="p-8 relative z-10">
                            <div className="font-mono text-xs text-gray-500 mb-2 tracking-widest">{item.sub}</div>
                            <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-white transition-colors uppercase tracking-tight">{item.title}</h3>
                            
                            <p className="text-gray-400 font-mono text-xs leading-relaxed group-hover:text-gray-300 transition-colors border-l border-white/10 pl-4">
                                {item.desc}
                            </p>
                        </div>

                        {/* Technical Markings */}
                        <div className="absolute bottom-4 left-4 text-[9px] font-mono text-dim">
                            MAX_LOAD: 100%
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <div className={`w-16 h-1 bg-white/10 overflow-hidden`}>
                                <div className={`h-full ${item.color.replace('border-', 'bg-').replace('/50', '')} w-[70%] group-hover:w-full transition-all duration-1000`} />
                            </div>
                        </div>

                        {/* Corner Screws */}
                        <div className="absolute top-2 left-2 text-white/5 text-[8px]">+</div>
                        <div className="absolute top-2 right-2 text-white/5 text-[8px]">+</div>
                        <div className="absolute bottom-2 left-2 text-white/5 text-[8px]">+</div>
                        <div className="absolute bottom-2 right-2 text-white/5 text-[8px]">+</div>
                        
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER CTA SECTION --- */}
      <section className="relative w-full py-12 px-6 md:px-20 text-center overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-[120%] h-px bg-white rotate-12" />
            <div className="w-[120%] h-px bg-white -rotate-12" />
        </div>

        <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             className="relative z-10"
        >
            <div className="inline-block px-4 py-1 border border-primary/50 text-primary font-mono text-xs tracking-[0.2em] mb-6 bg-black/50 backdrop-blur-sm">
                SYSTEM STATUS: READY
            </div>
            
            {/* CTA Text - Fixed Hover */}
            <h2 className="text-5xl md:text-9xl font-display font-bold text-white mb-8 hover:text-primary transition-all duration-300 cursor-default">
                START PROJECT
            </h2>
            
             <Link to="/contact">
                <button className="group relative bg-white text-black px-12 py-6 font-bold font-mono text-lg overflow-hidden transition-transform hover:scale-105 clip-path-slant mx-auto block pointer-events-auto">
                    <span className="relative z-10 flex items-center gap-2">
                        INITIATE_CONTACT <ChevronRight />
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </button>
            </Link>
        </motion.div>
      </section>

      {/* Footer System Stats */}
      <div className="w-full border-t border-white/10 bg-black py-8 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-dim">
        <div className="mb-2 md:mb-0">© 2024 ACE WAHOME // MECHATRONICS</div>
        <div className="flex gap-4">
            <span>SYS: ONLINE</span>
            <span>RENDER: WEBGL 2.0</span>
            <span>60 FPS</span>
        </div>
      </div>
    </div>
  );
};