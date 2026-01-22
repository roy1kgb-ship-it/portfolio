import React from 'react';
// @ts-ignore
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Printer, Lock, FileText, Database } from 'lucide-react';
import { articles } from '../data/articles';
import { ProjectVisualizer } from '../components/ProjectVisualizer';

export const LabNoteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-red-500 font-mono">
        <div className="text-center">
            <h1 className="text-4xl mb-4">404</h1>
            <p>ENTRY_NOT_FOUND [{id}]</p>
            <button 
                onClick={() => navigate('/lab')}
                className="mt-8 text-white border border-white/20 px-4 py-2 hover:bg-white/10"
            >
                RETURN TO LAB
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-48 relative bg-background">
      {/* Decorative Top Bar */}
      <div className="fixed top-20 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent z-40" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
        {/* LEFT COLUMN: Metadata Sidebar (Sticky) */}
        <div className="lg:col-span-3 order-1">
            <div className="sticky top-32 space-y-8">
                
                <button 
                    onClick={() => navigate('/lab')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm">BACK_TO_INDEX</span>
                </button>

                {/* Metadata Card */}
                <div className="bg-surface/50 border border-white/10 p-6 rounded backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4 text-xs font-mono text-dim border-b border-white/5 pb-2">
                        <Database size={12} />
                        <span>METADATA</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase">FILE_ID</div>
                            <div className="text-sm font-mono text-white">{article.id.toUpperCase()}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase">DATE_LOGGED</div>
                            <div className="text-sm font-mono text-white flex items-center gap-2">
                                <Calendar size={12} className="text-secondary" />
                                {article.date}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase">EST_READ_TIME</div>
                            <div className="text-sm font-mono text-white flex items-center gap-2">
                                <Clock size={12} className="text-primary" />
                                {article.readTime}
                            </div>
                        </div>
                         <div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase">CLASSIFICATION</div>
                            <div className="text-sm font-mono text-white flex items-center gap-2">
                                <Tag size={12} className="text-green-500" />
                                {article.tag}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-green-500/5 border border-green-500/20 p-4 rounded flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-green-500">DECRYPTED_SUCCESSFULLY</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded flex justify-center text-gray-400 hover:text-white transition-colors">
                        <Printer size={16} />
                    </button>
                    <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded flex justify-center text-gray-400 hover:text-white transition-colors">
                        <Share2 size={16} />
                    </button>
                </div>

            </div>
        </div>

        {/* RIGHT COLUMN: Main Content */}
        <motion.article 
            {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } as any}
            transition={{ duration: 0.5 }}
            className="lg:col-span-9 order-2"
        >
            {/* Header Plate */}
            <div className="bg-surface/30 border border-white/10 p-8 md:p-12 rounded-lg relative overflow-hidden mb-8">
                {/* Tech Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-mono tracking-widest rounded-full inline-flex items-center gap-2">
                            <Lock size={10} /> PUBLIC_ACCESS
                        </div>
                        <FileText size={24} className="text-white/20" />
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
                        {article.title}
                    </h1>
                    
                    <div className="p-6 bg-black/40 border-l-2 border-secondary rounded-r-lg">
                        <p className="text-xl text-gray-300 font-sans italic">
                            "{article.excerpt}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Data Visualizer (Topic Specific) */}
            <div className="w-full h-[300px] mb-8 rounded-lg border border-white/10 overflow-hidden relative bg-[#0a0a0a] group">
                <ProjectVisualizer projectId={article.id} />
                <div className="absolute top-4 left-4 text-[10px] font-mono text-primary bg-black/80 px-2 py-1 rounded border border-primary/20">
                     LIVE_METRICS // {article.tag}
                </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none bg-black/20 p-8 md:p-12 rounded-lg border border-white/5">
                {article.content.map((contentItem, idx) => {
                    // Make first paragraph drop-cap style or emphasized
                    if (idx === 0) {
                        return (
                            <p key={idx} className="mb-8 text-gray-200 font-sans text-xl leading-8 first-letter:text-5xl first-letter:font-display first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]">
                                {contentItem}
                            </p>
                        )
                    }
                    return (
                        <p key={idx} className="mb-6 text-gray-400 font-sans leading-7">
                            {contentItem}
                        </p>
                    )
                })}
            </div>

            {/* Footer Signature */}
            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-white">RW</div>
                    <div>
                        <div className="text-sm text-white font-bold">ROY WAHOME</div>
                        <div className="text-xs text-dim font-mono">MECHATRONICS STUDENT</div>
                    </div>
                </div>
                 <div className="text-right hidden md:block">
                    <div className="text-[10px] font-mono text-dim">SESSION_ID</div>
                    <div className="text-xs font-mono text-gray-500">8X92-AFF3-001</div>
                </div>
            </div>

        </motion.article>

      </div>
    </div>
  );
};