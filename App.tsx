import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { Navigation } from './components/Navigation';
import { Scene } from './components/Scene';
import { CustomCursor } from './components/CustomCursor';
import { BootSequence } from './components/BootSequence';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { LabNotes } from './pages/LabNotes';
import { LabNoteDetails } from './pages/LabNoteDetails';

function App() {
  const location = useLocation();
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    // FORCE FOCUS
    window.focus();

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background text-white selection:bg-primary selection:text-white font-sans cursor-none" style={{ touchAction: 'auto' }}>
      
      {/* Boot Sequence Overlay */}
      <BootSequence onComplete={() => setBootComplete(true)} />

      {/* Render Main Content only after boot */}
      {bootComplete && (
        <>
            <ScrollToTop /> {/* Handle Scroll Restoration */}
            
            {/* Custom Cursor */}
            <CustomCursor />

            {/* 3D Background - Persistent */}
            <Scene />

            {/* Persistent Noise Overlay */}
            <div className="bg-noise" />

            {/* Global Navigation */}
            <Navigation />

            {/* Vignette & Scanlines */}
            <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10 mix-blend-overlay" />

            {/* Main Content Area */}
            <main className="relative z-10 w-full min-h-screen">
                <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/lab" element={<LabNotes />} />
                    <Route path="/lab/:id" element={<LabNoteDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
                </AnimatePresence>
            </main>
        </>
      )}

    </div>
  );
}

export default App;