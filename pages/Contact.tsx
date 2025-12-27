import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Github, Linkedin, Mail, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "ace.wahome@engineer.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Increased padding bottom to 48
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-48 flex flex-col items-center justify-center relative">
        
        <div className="max-w-2xl w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-12"
            >
                <div className="inline-block px-3 py-1 mb-4 border border-green-500/30 bg-green-500/10 text-green-500 font-mono text-xs tracking-widest rounded-full">
                    SIGNAL_STRENGTH: STRONG
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">ESTABLISH <span className="text-primary">UPLINK</span></h1>
                <p className="text-gray-400 font-sans">
                    Available for entry-level engineering roles, research collaboration, and freelance projects.
                </p>
            </motion.div>

            {/* Terminal Form */}
            <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-black/80 border border-white/10 p-1 rounded-lg shadow-2xl backdrop-blur-xl"
            >
                <div className="bg-surface/50 p-2 flex items-center gap-2 rounded-t border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    <span className="ml-4 text-[10px] font-mono text-gray-500">bash --contact-mode</span>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="relative group cursor-pointer" onClick={handleCopy}>
                        <label className="block text-[10px] font-mono text-secondary mb-1">EMAIL (CLICK TO COPY)</label>
                        <div className="flex items-center justify-between bg-black/50 border border-white/10 p-4 rounded hover:border-secondary transition-colors">
                            <span className="font-mono text-lg text-white">{email}</span>
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500 group-hover:text-secondary" />}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <a 
                            href="https://github.com/ace-wahome" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 border border-white/10 hover:bg-white hover:text-black transition-all duration-300 rounded group"
                        >
                            <Github size={20} />
                            <span className="font-mono text-sm">GITHUB</span>
                        </a>
                         <a 
                            href="https://www.linkedin.com/in/ace-wahome" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 border border-white/10 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 rounded group"
                        >
                            <Linkedin size={20} />
                            <span className="font-mono text-sm">LINKEDIN</span>
                        </a>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-12 flex justify-center gap-8"
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                    <span className="text-[10px] font-mono text-gray-600">ENCRYPTED CONNECTION</span>
                </div>
            </motion.div>
        </div>

    </div>
  );
};