import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Github, Linkedin, Send, AlertTriangle, ShieldCheck, Lock, Terminal } from 'lucide-react';
import { ContactSchema, sanitizeInput, checkRateLimit, ContactFormData } from '../utils/security';
import { z } from 'zod';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "ace.wahome@engineer.com";

  // Form State
  const [formState, setFormState] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<'IDLE' | 'VALIDATING' | 'SENDING' | 'SUCCESS' | 'ERROR' | 'RATE_LIMITED'>('IDLE');
  const [rateLimitTimer, setRateLimitTimer] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Real-time Sanitization (Visual only, full sanitization happens on submit)
    // We allow typing but sanitize the state update to prevent pasting of massive scripts
    const safeValue = value.replace(/[<>]/g, ''); 
    
    setFormState(prev => ({ ...prev, [name]: safeValue }));
    // Clear error for this field on change
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('VALIDATING');
    setErrors({});

    // 1. RATE LIMIT CHECK
    const limitCheck = checkRateLimit();
    if (!limitCheck.allowed) {
        setStatus('RATE_LIMITED');
        setRateLimitTimer(limitCheck.waitTime || 60);
        return;
    }

    // 2. INPUT SANITIZATION
    const cleanData = {
        name: sanitizeInput(formState.name),
        email: sanitizeInput(formState.email),
        message: sanitizeInput(formState.message)
    };

    // 3. SCHEMA VALIDATION
    try {
        ContactSchema.parse(cleanData);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors: any = {};
            err.errors.forEach(error => {
                if (error.path[0]) fieldErrors[error.path[0]] = error.message;
            });
            setErrors(fieldErrors);
            setStatus('ERROR');
            return;
        }
    }

    // 4. SIMULATE SECURE TRANSMISSION
    setStatus('SENDING');
    
    // Mock API Call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success
    setStatus('SUCCESS');
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('IDLE'), 5000);
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-48 flex flex-col items-center justify-center relative">
        
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Contact Info */}
            <div className="order-2 lg:order-1">
                <motion.div
                    {...{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } } as any}
                    transition={{ duration: 0.4 }}
                    className="mb-12"
                >
                    <div className="inline-block px-3 py-1 mb-4 border border-green-500/30 bg-green-500/10 text-green-500 font-mono text-xs tracking-widest rounded-full">
                        SIGNAL_STRENGTH: STRONG
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">ESTABLISH <span className="text-primary">UPLINK</span></h1>
                    <p className="text-gray-400 font-sans leading-relaxed">
                        Secure channel open for engineering inquiries, research collaboration, and classified project proposals.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    <div className="relative group cursor-pointer" onClick={handleCopy}>
                        <label className="block text-[10px] font-mono text-secondary mb-1">DIRECT_FREQUENCY (EMAIL)</label>
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
            </div>

            {/* Right Column: Secure Form */}
            <motion.div 
                {...{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } } as any}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="order-1 lg:order-2 bg-[#050505] border border-white/10 rounded-lg overflow-hidden shadow-2xl relative"
            >
                {/* Terminal Header */}
                <div className="bg-[#111] px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-dim">
                        <Terminal size={12} />
                        <span>SECURE_TRANSMISSION_PROTOCOL</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                        <div className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 relative">
                    {/* Status Overlay for Success/RateLimit */}
                    <AnimatePresence>
                        {status === 'SUCCESS' && (
                            <motion.div 
                                {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } as any}
                                className="absolute inset-0 z-20 bg-[#050505]/95 flex flex-col items-center justify-center text-center p-8"
                            >
                                <ShieldCheck size={48} className="text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">TRANSMISSION SENT</h3>
                                <p className="text-sm text-gray-400 font-mono">Payload delivered successfully. Encrypted handshake complete.</p>
                            </motion.div>
                        )}
                        {status === 'RATE_LIMITED' && (
                            <motion.div 
                                {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } as any}
                                className="absolute inset-0 z-20 bg-[#050505]/95 flex flex-col items-center justify-center text-center p-8"
                            >
                                <AlertTriangle size={48} className="text-red-500 mb-4" />
                                <h3 className="text-xl font-bold text-red-500 mb-2">TRAFFIC LIMIT EXCEEDED</h3>
                                <p className="text-sm text-gray-400 font-mono mb-4">Uplink unstable. Cooling down buffers.</p>
                                <div className="text-2xl font-mono text-white">{rateLimitTimer}s</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Identity Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-primary uppercase tracking-wider flex justify-between">
                            <span>IDENTITY (NAME)</span>
                            {errors.name && <span className="text-red-500 animate-pulse">{errors.name}</span>}
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.name ? 'border-red-500/50 text-red-500' : 'border-white/10 focus:border-primary/50 text-white'} rounded p-3 font-mono text-sm outline-none transition-colors placeholder:text-white/10`}
                            placeholder="ENTER_IDENTITY"
                            disabled={status === 'SENDING'}
                        />
                    </div>

                    {/* Frequency Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-secondary uppercase tracking-wider flex justify-between">
                            <span>RETURN_FREQUENCY (EMAIL)</span>
                            {errors.email && <span className="text-red-500 animate-pulse">{errors.email}</span>}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.email ? 'border-red-500/50 text-red-500' : 'border-white/10 focus:border-secondary/50 text-white'} rounded p-3 font-mono text-sm outline-none transition-colors placeholder:text-white/10`}
                            placeholder="USER@DOMAIN.COM"
                            disabled={status === 'SENDING'}
                        />
                    </div>

                    {/* Payload Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex justify-between">
                            <span>DATA_PAYLOAD (MESSAGE)</span>
                            {errors.message && <span className="text-red-500 animate-pulse">{errors.message}</span>}
                        </label>
                        <textarea
                            name="message"
                            value={formState.message}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full bg-black/50 border ${errors.message ? 'border-red-500/50 text-red-500' : 'border-white/10 focus:border-white/30 text-white'} rounded p-3 font-mono text-sm outline-none transition-colors placeholder:text-white/10 resize-none`}
                            placeholder="Start typing transmission..."
                            disabled={status === 'SENDING'}
                        />
                        <div className="text-[10px] text-right text-dim">{formState.message.length}/1000 BYTES</div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === 'SENDING'}
                        className="w-full relative group overflow-hidden bg-white text-black font-bold font-mono py-4 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'SENDING' ? (
                            <>
                                <span className="animate-pulse">ENCRYPTING...</span>
                            </>
                        ) : (
                            <>
                                <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                <span>INITIATE_UPLOAD</span>
                            </>
                        )}
                        
                        {/* Security Badge */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20">
                            <Lock size={14} />
                        </div>
                    </button>
                    
                    <div className="flex justify-center gap-4 text-[10px] font-mono text-dim pt-2">
                        <span className="flex items-center gap-1"><ShieldCheck size={10} /> TLS_1.3</span>
                        <span className="flex items-center gap-1"><Lock size={10} /> E2E_ENCRYPTED</span>
                    </div>

                </form>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-10 opacity-20" />
            </motion.div>

        </div>

        <motion.div 
            {...{ initial: { opacity: 0 }, animate: { opacity: 1 } } as any}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-12 flex justify-center gap-8"
        >
            <div className="flex flex-col items-center gap-2">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                <span className="text-[10px] font-mono text-gray-600">AUTHORIZED PERSONNEL ONLY</span>
            </div>
        </motion.div>

    </div>
  );
};