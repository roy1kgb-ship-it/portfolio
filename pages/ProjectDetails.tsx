import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Shield, Activity, GitBranch, Code, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { projects } from '../data/projects';
import { ProjectVisualizer } from '../components/ProjectVisualizer';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-red-500 font-mono">
        <div className="text-center">
            <h1 className="text-4xl mb-4">404</h1>
            <p>ERROR: PROJECT_NOT_FOUND [{id}]</p>
            <button 
                onClick={() => navigate('/projects')}
                className="mt-8 text-white border border-white/20 px-4 py-2 hover:bg-white/10"
            >
                RETURN TO ARCHIVE
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-48 relative overflow-hidden">
      
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/projects')}
        className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors z-20 relative"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono text-sm">BACK TO ARCHIVE</span>
      </button>

      {/* Dynamic Visualizer Section (Replaces Static Hero Image) */}
      <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-[40vh] md:h-[60vh] rounded-lg overflow-hidden my-8 relative border border-white/10 group bg-[#0a0a0a]"
      >
          {/* Visualizer Component */}
          <ProjectVisualizer projectId={project.id} />

          {/* Scanline overlay (subtle) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10" />
      </motion.div>

      {/* Header Section */}
      <div className="border-b border-white/10 pb-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-primary font-mono text-sm tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                        ID: #{project.id}
                    </span>
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${
                        project.status === 'CLASSIFIED' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                    }`}>
                        STATUS: {project.status}
                    </span>
                    {project.date && <span className="text-[10px] font-mono text-dim border border-white/10 px-2 py-0.5 rounded">{project.date}</span>}
                </div>
                <h1 className="text-3xl md:text-7xl font-display font-bold text-white leading-tight">
                    {project.title}
                </h1>
            </div>
            <div className="text-left md:text-right">
                <div className="text-xs font-mono text-dim">AUTHOR</div>
                <div className="text-sm font-mono text-gray-300">ACE WAHOME</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Description & Case Study */}
        <div className="lg:col-span-2 space-y-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="text-lg font-mono text-secondary mb-4 flex items-center gap-2">
                    <Activity size={16} /> MISSION_BRIEF
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed font-sans border-l-2 border-white/10 pl-6">
                    {project.description}
                </p>
            </motion.div>

            {/* Engineering Case Study Sections */}
            {(project.challenge || project.solution) && (
                <motion.div 
                    className="grid gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {project.challenge && (
                        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded">
                            <h3 className="text-red-400 font-mono text-sm mb-3 flex items-center gap-2">
                                <AlertTriangle size={14} /> THE_CHALLENGE
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {project.challenge}
                            </p>
                        </div>
                    )}
                    
                    {project.solution && (
                         <div className="bg-green-500/5 border border-green-500/10 p-6 rounded">
                            <h3 className="text-green-400 font-mono text-sm mb-3 flex items-center gap-2">
                                <CheckCircle2 size={14} /> THE_SOLUTION
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {project.solution}
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4, delay: 0.2 }}
            >
                <h2 className="text-lg font-mono text-secondary mb-6 flex items-center gap-2">
                    <Cpu size={16} /> TECHNICAL_SPECS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.specs.map((spec, i) => {
                        const parts = spec.split(':');
                        const label = parts[0];
                        const value = parts.slice(1).join(':'); 
                        return (
                            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded hover:border-white/20 transition-colors flex justify-between items-center">
                                <span className="text-dim text-xs font-mono uppercase">{label}</span>
                                <span className="text-white font-display text-lg">{value}</span>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-6 bg-surface/50 border-l-2 border-primary backdrop-blur-sm"
            >
                <h3 className="text-sm font-mono text-gray-500 mb-4">TECH_STACK</h3>
                <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                        <span key={t} className="bg-white/10 text-white px-3 py-1.5 rounded-sm text-xs font-mono border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.4, delay: 0.4 }}
                 className="p-6 bg-surface/50 border-l-2 border-secondary backdrop-blur-sm"
            >
                <h3 className="text-sm font-mono text-gray-500 mb-4">RESOURCES</h3>
                <div className="space-y-3">
                    <button className="w-full flex justify-between items-center text-sm text-gray-300 hover:text-white group bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2"><GitBranch size={14} /> Repository</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-dim group-hover:text-primary">LOCKED</span>
                            <Lock size={12} className="text-dim group-hover:text-primary" />
                        </div>
                    </button>
                    <button className="w-full flex justify-between items-center text-sm text-gray-300 hover:text-white group bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                        <span className="flex items-center gap-2"><Shield size={14} /> Documentation</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-dim group-hover:text-primary">LOCKED</span>
                            <Lock size={12} className="text-dim group-hover:text-primary" />
                        </div>
                    </button>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};