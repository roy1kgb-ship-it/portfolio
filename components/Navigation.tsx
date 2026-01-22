import React from 'react';
// @ts-ignore
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Cpu, User, Radio, BookOpen } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { id: 'home', label: 'HOME', path: '/' },
  { id: 'projects', label: 'PROJECTS', path: '/projects' },
  { id: 'lab', label: 'LAB_NOTES', path: '/lab' },
  { id: 'about', label: 'PROFILE', path: '/about' },
  { id: 'contact', label: 'CONTACT', path: '/contact' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <nav className="relative backdrop-blur-md bg-surface/80 border border-white/10 rounded-full px-6 py-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
        
        {/* Tech Decorators */}
        <div className="absolute -top-1 left-10 w-12 h-[1px] bg-primary/50" />
        <div className="absolute -bottom-1 right-10 w-12 h-[1px] bg-secondary/50" />

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="relative group flex flex-col items-center justify-center gap-1"
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white'}`}>
                {item.id === 'home' && <Home size={20} strokeWidth={1.5} />}
                {item.id === 'projects' && <Cpu size={20} strokeWidth={1.5} />}
                {item.id === 'lab' && <BookOpen size={20} strokeWidth={1.5} />}
                {item.id === 'about' && <User size={20} strokeWidth={1.5} />}
                {item.id === 'contact' && <Radio size={20} strokeWidth={1.5} />}
              </div>
              
              <span className="text-[10px] font-mono tracking-widest opacity-0 group-hover:opacity-100 absolute -top-8 transition-opacity text-primary whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-white/10">
                {`// ${item.label}`}
              </span>

              {isActive && (
                <motion.div
                  {...{ layoutId: "activeTab" } as any}
                  className="absolute -bottom-4 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#FF4D00]"
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};