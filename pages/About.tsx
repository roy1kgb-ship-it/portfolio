import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skill, Experience } from '../types';
import { Briefcase, GraduationCap, Award, MapPin } from 'lucide-react';

// Simplified skill data structure for "Badge" view
const techStack = {
    software: [
        'Python (NumPy, Pandas)', 'C++ / C', 'ROS / ROS2', 'MATLAB / Simulink', 'FreeRTOS', 'Linux'
    ],
    hardware: [
        'Fusion 360', 'SolidWorks', 'KiCad (PCB)', 'Altium', 'PLC (Siemens)', 'CNC / 3D Printing'
    ]
};

const experience: Experience[] = [
    {
        role: "Undergraduate Researcher",
        company: "University Robotics Lab",
        period: "2024 - Present",
        description: "Developing a swarm robotics platform for search and rescue operations. Implemented SLAM algorithms on resource-constrained microcontrollers."
    },
    {
        role: "Mechatronics Intern",
        company: "Advanced Robotics Corp",
        period: "2024.09 - 2024.12",
        description: "Assisted in the design of end-effectors for 6-axis industrial arms. Reduced assembly time by 15% through DFMA optimization. Wrote Python scripts to automate calibration routines."
    }
];

// New Skill Badge Component
const SkillBadge = ({ name, category }: { name: string, category: 'soft' | 'hard', key?: any }) => {
    return (
        <div className={`px-3 py-2 border rounded font-mono textxs flex items-center justify-between group hover:scale-105 transition-transform cursor-default ${category === 'soft' ? 'border-secondary/30 bg-secondary/5 text-gray-300' : 'border-primary/30 bg-primary/5 text-gray-300'}`}>
            {name}
            <div className={`w-1.5 h-1.5 rounded-full ${category === 'soft' ? 'bg-secondary' : 'bg-primary'} opacity-50 group-hover:opacity-100`} />
        </div>
    )
}

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 pb-48">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        <div className="lg:w-2/3">
            <motion.h1 
                {...{ initial: { x: -30, opacity: 0 }, animate: { x: 0, opacity: 1 } } as any}
                transition={{ duration: 0.4 }}
                className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
            >
                PERSONNEL <span className="text-secondary">DOSSIER</span>
            </motion.h1>

             <motion.div 
                className="text-sm font-mono text-dim mb-4 flex items-center gap-2"
                {...{ initial: { opacity: 0 }, animate: { opacity: 1 } } as any}
                transition={{ delay: 0.1 }}
            >
                 <MapPin size={14} /> BASED IN NAIROBI, KENYA
            </motion.div>

            <motion.div 
                {...{ initial: { opacity: 0 }, animate: { opacity: 1 } } as any}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-gray-300 font-sans text-lg leading-relaxed max-w-2xl space-y-4"
            >
                <p>
                    <span className="text-primary font-bold">Roy Wahome</span>. Mechatronics Engineering Student.
                    My work sits at the precise intersection of mechanical design, electrical integration, and intelligent control systems.
                </p>
                <p>
                    Unlike pure software engineers, I understand the physical constraints of hardware. Unlike pure mechanical engineers, I can write the firmware that brings the metal to life. I build full-stack physical systems.
                </p>
            </motion.div>
        </div>
        
        {/* Education Card */}
        <div className="lg:w-1/3">
            <motion.div 
                {...{ initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } } as any}
                transition={{ delay: 0.2 }}
                className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm h-full hover:border-white/20 transition-colors"
            >
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <GraduationCap size={20} />
                    <span className="font-mono text-sm tracking-widest">EDUCATION</span>
                </div>
                <div className="mb-4">
                    <div className="text-xl font-bold text-white">B.S. Mechatronics Engineering</div>
                    <div className="text-gray-400 text-sm">University of Technology</div>
                    <div className="text-dim text-xs font-mono mt-1">2023 - 2028</div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Relevant Coursework:</div>
                    <p className="text-xs text-gray-400 font-mono mt-2 leading-relaxed">
                        Control Systems II, Industrial Automation, Embedded Logic, Dynamics of Machinery, Machine Vision, Finite Element Analysis.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Experience Timeline */}
          <div>
            <h2 className="text-xl font-mono text-secondary mb-8 flex items-center gap-2">
                <Briefcase size={18} /> FIELD_EXPERIENCE
            </h2>
            <div className="space-y-8 border-l border-white/10 pl-8 relative">
                {experience.map((job, index) => (
                    <motion.div 
                        key={index}
                        {...{ initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true } } as any}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[37px] top-1.5 w-3 h-3 bg-background border border-primary rounded-full group-hover:bg-primary transition-colors" />
                        
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.role}</h3>
                            <span className="text-xs font-mono text-gray-400">{job.period}</span>
                        </div>
                        <div className="text-sm text-primary mb-2 font-mono">{job.company}</div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {job.description}
                        </p>
                    </motion.div>
                ))}
            </div>
          </div>

          {/* Skill Matrix Grid (Replaces Sliders) */}
          <div>
            <h2 className="text-xl font-mono text-secondary mb-8 flex items-center gap-2">
                <Award size={18} /> TECHNICAL_STACK
            </h2>
            
            <div className="mb-8">
                <h3 className="text-xs font-mono text-dim mb-4 uppercase">Software & Control</h3>
                <div className="flex flex-wrap gap-3">
                    {techStack.software.map((skill, i) => (
                        <SkillBadge key={i} name={skill} category="soft" />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-mono text-dim mb-4 uppercase">Hardware & Manufacturing</h3>
                <div className="flex flex-wrap gap-3">
                    {techStack.hardware.map((skill, i) => (
                        <SkillBadge key={i} name={skill} category="hard" />
                    ))}
                </div>
            </div>

          </div>

      </div>

    </div>
  );
};