import React from 'react';
import { motion } from 'framer-motion';
import { articles } from '../data/articles';
import { Tag, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LabNotes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-48">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 flex justify-between items-end border-b border-white/10 pb-4"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">LAB NOTES</h1>
          <p className="text-primary font-mono text-sm">// ENGINEERING LOGS & RESEARCH</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] font-mono text-gray-500">ENTRIES: {articles.length}</div>
          <div className="text-[10px] font-mono text-gray-500">STATUS: PUBLIC</div>
        </div>
      </motion.div>

      <div className="grid gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            onClick={() => navigate(`/lab/${article.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative bg-surface/30 border border-white/5 hover:border-secondary/50 p-6 rounded transition-all cursor-pointer hover:bg-surface/50"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 text-[10px] font-mono text-dim">
                        <span className="flex items-center gap-1 text-secondary"><Tag size={10} /> {article.tag}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                        <span className="text-gray-500">{article.date}</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                        {article.title}
                    </h2>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-3xl line-clamp-2">
                        {article.excerpt}
                    </p>
                </div>
                
                <div className="flex items-center self-start">
                    <div className="p-2 rounded-full border border-white/10 group-hover:bg-secondary group-hover:text-black transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <span className="text-[10px] font-mono text-dim animate-pulse">END OF BUFFER</span>
      </div>
    </div>
  );
};