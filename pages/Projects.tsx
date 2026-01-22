import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';

export const Projects: React.FC = () => {
  return (
    // Increased bottom padding to pb-40 to account for fixed navbar
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-40">
        <motion.div
            {...{ initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } } as any}
            className="mb-12 flex justify-between items-end border-b border-white/10 pb-4"
        >
            <div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">BLUEPRINTS</h1>
                <p className="text-primary font-mono text-sm">// ACCESSING ARCHIVE...</p>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-[10px] font-mono text-gray-500">FILES FOUND: {projects.length}</div>
                <div className="text-[10px] font-mono text-gray-500">SECURITY: LEVEL 3</div>
            </div>
        </motion.div>

        {/* Changed grid-cols-3 to grid-cols-2 max for better card spacing and readability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    </div>
  );
};