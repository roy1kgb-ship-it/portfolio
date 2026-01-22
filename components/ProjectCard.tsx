import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Lock, FileCode } from 'lucide-react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useMotionTemplate`calc(${mouseYSpring} * -0.05deg)`; 
  const rotateY = useMotionTemplate`calc(${mouseXSpring} * 0.05deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 15); 
    y.set(yPct * 15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    setClicked(true);
    // Visual feedback delay before navigation
    setTimeout(() => {
        navigate(`/projects/${project.id}`);
    }, 300);
  };

  return (
    <motion.div
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } } as any}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      style={{
        transformStyle: "preserve-3d",
        rotateX: rotateX as any,
        rotateY: rotateY as any,
      }}
      className="group relative h-full flex flex-col bg-surface/40 backdrop-blur-md border border-white/5 hover:border-primary/50 transition-colors duration-300 rounded-sm cursor-pointer overflow-hidden min-h-[320px]"
    >
      {/* Click Feedback Overlay */}
      {clicked && (
         <motion.div 
            {...{ initial: { opacity: 0 }, animate: { opacity: 1 } } as any}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 z-50 bg-primary/10 flex items-center justify-center backdrop-blur-sm"
         >
             <div className="bg-black border border-primary p-2 text-primary font-mono text-xs animate-pulse">
                 LOADING_SCHEMATIC...
             </div>
         </motion.div>
      )}

      {/* Dynamic Sheen */}
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseXSpring}px ${mouseYSpring}px,
              rgba(255, 77, 0, 0.1),
              transparent 80%
            )
          `,
        }}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-sm"
      />

      {/* Corner Markers */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-white/30 group-hover:border-primary transition-colors" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-white/30 group-hover:border-primary transition-colors" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-white/30 group-hover:border-primary transition-colors" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-white/30 group-hover:border-primary transition-colors" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 relative z-10">
        <div className="flex justify-between items-start mb-4">
           <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5">#{project.id}</span>
           </div>
           {project.status === 'CLASSIFIED' ? (
                <Lock size={16} className="text-dim" />
            ) : (
                <div className="bg-white/5 p-1 rounded-full group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                    <ArrowUpRight size={16} />
                </div>
            )}
        </div>
        
        <h3 className="text-2xl font-display font-bold uppercase text-white group-hover:text-secondary transition-colors">
            {project.title}
        </h3>
        <span className="text-xs font-mono text-secondary tracking-widest mt-1 block">{project.category}</span>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10 flex flex-col flex-grow justify-between">
        <div>
            <p className="text-sm font-sans text-gray-300 mb-6 leading-relaxed line-clamp-3">
                {project.description}
            </p>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {project.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="text-[10px] font-mono border-l border-white/10 pl-2 py-1">
                        <span className="block text-dim uppercase">{spec.split(':')[0]}</span>
                        <span className="text-gray-300">{spec.split(':')[1]}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer / Tech Stack */}
        <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-white/5">
            <FileCode size={12} className="text-dim" />
            {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 rounded">
                    {t}
                </span>
            ))}
            {project.tech.length > 4 && <span className="text-[10px] text-dim">+{project.tech.length - 4}</span>}
        </div>
      </div>
    </motion.div>
  );
};