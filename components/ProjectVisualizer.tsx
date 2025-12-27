import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

interface VisualizerProps {
  projectId: string;
}

// STANDARD RES: 1920 x 1080 (16:9)
// This ensures drawing logic is consistent and scaled correctly.
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// --- PROJECT ANIMATIONS ---

// 1. QUADRUPED LEG IK (K-9)
const QuadrupedLeg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let t = 0;
        let animationFrame: number;
        const L1 = 180;
        const L2 = 180;
        const OriginX = CANVAS_WIDTH / 2; 
        const OriginY = CANVAS_HEIGHT / 3;
        const animate = () => {
            t += 0.05; 
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const footX = OriginX + Math.cos(t) * 120;
            const footY = OriginY + 400 + Math.sin(t) * 60 * (Math.sin(t) > 0 ? 1 : 0); 
            const dx = footX - OriginX;
            const dy = footY - OriginY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const clampedDist = Math.min(dist, L1 + L2 - 1);
            const alpha = Math.acos((L1*L1 + clampedDist*clampedDist - L2*L2) / (2*L1*clampedDist));
            const beta = Math.atan2(dy, dx);
            const theta1 = beta - alpha; 
            const kneeX = OriginX + L1 * Math.cos(theta1);
            const kneeY = OriginY + L1 * Math.sin(theta1);
            ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(OriginX - 200, OriginY); ctx.lineTo(OriginX + 200, OriginY); ctx.stroke();
            ctx.strokeStyle = '#00F0FF'; ctx.beginPath(); ctx.moveTo(OriginX, OriginY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(footX, footY); ctx.stroke();
            ctx.fillStyle = '#111'; ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(OriginX, OriginY, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.arc(kneeX, kneeY, 12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#FF4D00'; ctx.strokeStyle = '#FF4D00'; ctx.beginPath(); ctx.arc(footX, footY, 10, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, OriginY + 400 + 15); ctx.lineTo(CANVAS_WIDTH, OriginY + 400 + 15); ctx.stroke();
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
};

// 2. CONVEYOR BELT (PLC)
const ConveyorSystem = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let items = [{x: 0, type: 'metal'}, {x: -600, type: 'plastic'}, {x: -1200, type: 'metal'}];
        let animationFrame: number;
        const animate = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const BeltY = 700;
            ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, BeltY, CANVAS_WIDTH, 40);
            ctx.fillStyle = '#333';
            for(let i=50; i<CANVAS_WIDTH; i+=150) { ctx.beginPath(); ctx.arc(i, BeltY + 20, 15, 0, Math.PI*2); ctx.fill(); }
            ctx.fillStyle = 'rgba(0, 240, 255, 0.1)'; ctx.fillRect(800, BeltY - 300, 10, 300);
            ctx.fillStyle = '#00F0FF'; ctx.font = '30px monospace'; ctx.fillText('SENSOR_ARRAY', 700, BeltY - 320);
            ctx.fillStyle = 'rgba(255, 77, 0, 0.3)'; ctx.fillRect(1200, BeltY - 250, 100, 150);
            ctx.fillStyle = '#FF4D00'; ctx.fillText('EJECTOR', 1200, BeltY - 270);
            items.forEach(item => {
                item.x += 8;
                if (item.x > CANVAS_WIDTH + 100) item.x = -200;
                if (Math.abs(item.x - 800) < 20 && item.type === 'metal') { ctx.fillStyle = '#00F0FF'; ctx.beginPath(); ctx.arc(805, BeltY - 200, 20, 0, Math.PI*2); ctx.fill(); }
                let yOff = 0; let rot = 0;
                if (item.x > 1200 && item.x < 1400 && item.type === 'metal') { yOff = -200 * Math.sin((item.x - 1200)/200 * Math.PI); rot = (item.x - 1200) * 0.1; }
                ctx.save(); ctx.translate(item.x, BeltY - 80 + yOff); ctx.rotate(rot * Math.PI / 180);
                ctx.fillStyle = item.type === 'metal' ? '#888' : '#222'; ctx.strokeStyle = item.type === 'metal' ? '#fff' : '#444'; ctx.lineWidth = 4;
                ctx.fillRect(-40, -40, 80, 80); ctx.strokeRect(-40, -40, 80, 80); ctx.restore();
            });
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 3. ARTIFICIAL HORIZON (DRONE)
const FlightHorizon = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let t = 0;
        let animationFrame: number;
        const animate = () => {
            t += 0.005; ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const cx = CANVAS_WIDTH / 2; const cy = CANVAS_HEIGHT / 2;
            const roll = Math.sin(t * 2) * 0.4; const pitch = Math.cos(t) * 100;
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(roll); ctx.translate(0, pitch);
            ctx.fillStyle = '#00F0FF'; ctx.globalAlpha = 0.1; ctx.fillRect(-CANVAS_WIDTH, -CANVAS_HEIGHT, CANVAS_WIDTH*2, CANVAS_HEIGHT);
            ctx.fillStyle = '#FF4D00'; ctx.fillRect(-CANVAS_WIDTH, 0, CANVAS_WIDTH*2, CANVAS_HEIGHT);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-CANVAS_WIDTH, 0); ctx.lineTo(CANVAS_WIDTH, 0); ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '20px monospace';
            for (let i = -90; i <= 90; i+=10) { if (i === 0) continue; const y = i * 15; ctx.fillRect(-50, -y, 100, 2); ctx.fillText(i.toString(), -70, -y + 5); ctx.fillText(i.toString(), 70, -y + 5); }
            ctx.restore();
            ctx.globalAlpha = 1; ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(cx - 60, cy); ctx.lineTo(cx - 20, cy); ctx.lineTo(cx, cy + 20); ctx.lineTo(cx + 20, cy); ctx.lineTo(cx + 60, cy); ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = '30px monospace'; ctx.textAlign = 'left';
            ctx.fillText(`ROLL: ${(roll * 57.29).toFixed(1)}°`, 50, CANVAS_HEIGHT - 100); ctx.fillText(`PITCH: ${(pitch/15).toFixed(1)}°`, 50, CANVAS_HEIGHT - 60);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 4. CV SCANNER
const VisionSystem = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let scanY = 0; let animationFrame: number; let defects = [{x: 600, y: 300}, {x: 1300, y: 700}];
        const animate = () => {
            scanY += 8; if (scanY > CANVAS_HEIGHT) scanY = 0;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = 'rgba(255,255,255,0.03)'; for(let i=0; i<CANVAS_WIDTH; i+=100) { ctx.fillRect(i, 0, 2, CANVAS_HEIGHT); } for(let i=0; i<CANVAS_HEIGHT; i+=100) { ctx.fillRect(0, i, CANVAS_WIDTH, 2); }
            ctx.strokeStyle = '#333'; ctx.lineWidth = 8; ctx.strokeRect(300, 100, 1320, 880);
            ctx.fillStyle = '#1a1a1a'; ctx.fillRect(800, 400, 320, 320); ctx.strokeRect(800, 400, 320, 320);
            defects.forEach(d => {
                ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(d.x, d.y, 15, 0, Math.PI*2); ctx.fill();
                if (Math.abs(scanY - d.y) < 50) { ctx.strokeStyle = '#FF4D00'; ctx.lineWidth = 4; ctx.strokeRect(d.x - 40, d.y - 40, 80, 80); ctx.fillStyle = '#FF4D00'; ctx.font = '24px monospace'; ctx.fillText('DEFECT_DETECTED [99%]', d.x + 60, d.y); }
            });
            ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(CANVAS_WIDTH, scanY); ctx.stroke();
            ctx.fillStyle = 'rgba(0, 240, 255, 0.05)'; ctx.fillRect(0, scanY - 100, CANVAS_WIDTH, 100);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// --- LAB NOTE ANIMATIONS ---

// 5. LAB NOTE 001: Soft Robotics Control (PID vs MPC)
const SoftRoboticsSim = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        let t = 0;
        let animationFrame: number;
        const animate = () => {
            t += 0.5;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Draw Graph Axis
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(100, 100); ctx.lineTo(100, 900); ctx.lineTo(1800, 900);
            ctx.stroke();

            // Setpoint Line (Dashed)
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(100, 500); ctx.lineTo(1800, 500);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw MPC Curve (Smooth)
            ctx.strokeStyle = '#00F0FF';
            ctx.lineWidth = 4;
            ctx.beginPath();
            for(let x=100; x<1800; x+=10) {
                // Sigmoid-like curve
                const progress = (x - 100) / 1000;
                let y = 900;
                if (progress > 0) {
                     // 1 - e^(-3t) type rise
                     const val = 1 - Math.exp(-3 * progress);
                     y = 900 - (val * 400); 
                }
                if (x === 100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw PID Curve (Oscillating) - Animated Scan
            ctx.strokeStyle = '#FF4D00';
            ctx.beginPath();
            
            for(let x=100; x<1800; x+=10) {
                const progress = (x - 100) / 1000;
                let y = 900;
                if (progress > 0) {
                     // Underdamped response e^(-t)*cos(t)
                     const val = 1 - Math.exp(-1.5 * progress) * Math.cos(6 * progress);
                     y = 900 - (val * 400);
                }
                if (x === 100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Labels
            ctx.font = '30px monospace';
            ctx.fillStyle = '#00F0FF'; ctx.fillText('MPC [OPTIMIZED]', 1400, 450);
            ctx.fillStyle = '#FF4D00'; ctx.fillText('PID [OSCILLATION]', 1400, 650);

            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 6. LAB NOTE 002: ROS2 Network
const ROS2Network = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        const nodes = [
            {x: 960, y: 540, label: 'MASTER_AGENT', r: 60, color: '#00F0FF'},
            {x: 400, y: 300, label: 'ESP32_IMU', r: 40, color: '#FF4D00'},
            {x: 400, y: 780, label: 'ESP32_MOTOR', r: 40, color: '#FF4D00'},
            {x: 1500, y: 540, label: 'VISUALIZER', r: 40, color: '#888'},
        ];

        let packets: any[] = [];
        let t = 0;
        let animationFrame: number;

        const animate = () => {
            t++;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Spawn packets
            if (t % 60 === 0) {
                packets.push({ from: 1, to: 0, p: 0, color: '#FF4D00' });
                packets.push({ from: 2, to: 0, p: 0, color: '#FF4D00' });
            }
            if (t % 60 === 30) {
                packets.push({ from: 0, to: 3, p: 0, color: '#00F0FF' });
            }

            // Draw Connections
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.beginPath();
            // Connect ESPs to Master, Master to Viz
            ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[0].x, nodes[0].y);
            ctx.moveTo(nodes[2].x, nodes[2].y); ctx.lineTo(nodes[0].x, nodes[0].y);
            ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[3].x, nodes[3].y);
            ctx.stroke();

            // Update & Draw Packets
            packets = packets.filter(pkt => pkt.p < 1);
            packets.forEach(pkt => {
                pkt.p += 0.02;
                const start = nodes[pkt.from];
                const end = nodes[pkt.to];
                const cx = start.x + (end.x - start.x) * pkt.p;
                const cy = start.y + (end.y - start.y) * pkt.p;
                
                ctx.fillStyle = pkt.color;
                ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI*2); ctx.fill();
            });

            // Draw Nodes
            nodes.forEach(node => {
                ctx.fillStyle = '#0a0a0a';
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                
                ctx.fillStyle = '#fff';
                ctx.font = '20px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + node.r + 30);
            });

            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 7. LAB NOTE 003: Generative Design / Topology Optimization
const TopologyOptimizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        let iteration = 0;
        let animationFrame: number;
        
        // Grid of "voxels"
        const gridSize = 40;
        const cols = CANVAS_WIDTH / gridSize;
        const rows = CANVAS_HEIGHT / gridSize;

        const animate = () => {
            iteration++;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Simulate "Load Path"
            const startX = 200; const startY = 540;
            const endX = 1700; const endY = 540;
            
            ctx.fillStyle = '#222';
            
            for(let y=0; y<rows; y++) {
                for(let x=0; x<cols; x++) {
                    const px = x * gridSize;
                    const py = y * gridSize;
                    
                    // Simple logic: Keep material near the "Truss" lines
                    const distToCenter = Math.abs(py - 540);
                    const wave = Math.sin(x * 0.1 + iteration * 0.05) * 200;
                    
                    const density = Math.min(1, 200 / (Math.abs(distToCenter - Math.abs(wave)) + 1));
                    
                    if (density > 0.3) {
                         const size = gridSize * density * 0.9;
                         const colorVal = Math.floor(density * 255);
                         ctx.fillStyle = `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
                         ctx.fillRect(px + (gridSize-size)/2, py + (gridSize-size)/2, size, size);
                    }
                }
            }
            
            // Draw Forces
            ctx.strokeStyle = '#FF4D00';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(startX, startY); ctx.lineTo(startX - 100, startY); // Anchor
            ctx.stroke();
            
            ctx.strokeStyle = '#00F0FF';
            ctx.beginPath();
            ctx.moveTo(endX, endY); ctx.lineTo(endX, endY + 100); // Load
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = '30px monospace';
            ctx.fillText(`ITERATION: ${iteration}`, 50, 50);

            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 8. LAB NOTE 004: Kalman Filter
const KalmanFilterVis = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        let t = 0;
        let animationFrame: number;
        
        const animate = () => {
            t += 2;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            ctx.lineWidth = 4;
            
            // True Path (Sine Wave)
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            for(let x=0; x<CANVAS_WIDTH; x+=10) {
                const y = 540 + Math.sin((x + t) * 0.005) * 300;
                if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Noisy Measurements (Dots)
            ctx.fillStyle = '#FF4D00';
            for(let x=0; x<CANVAS_WIDTH; x+=40) {
                 // Deterministic random for consistent animation
                 const trueY = 540 + Math.sin((x + t) * 0.005) * 300;
                 const noise = Math.sin(x * 123.123 + t) * 150; 
                 ctx.beginPath(); ctx.arc(x, trueY + noise, 6, 0, Math.PI*2); ctx.fill();
            }

            // Estimated Path (Kalman - Smooth line)
            ctx.strokeStyle = '#00F0FF';
            ctx.lineWidth = 6;
            ctx.beginPath();
            
            // Simple low-pass for visualization
            for(let x=0; x<CANVAS_WIDTH; x+=10) {
                const trueY = 540 + Math.sin((x + t) * 0.005) * 300;
                const noise = Math.sin(x * 123.123 + t) * 150;
                // Weighted average logic visual
                const estY = trueY + noise * 0.1; 
                if(x===0) ctx.moveTo(x,estY); else ctx.lineTo(x,estY);
            }
            ctx.stroke();
            
            // Legend
            ctx.font = '24px monospace';
            ctx.fillStyle = '#fff'; ctx.fillText('TRUE_STATE', 50, 50);
            ctx.fillStyle = '#FF4D00'; ctx.fillText('NOISY_MEASUREMENT', 50, 90);
            ctx.fillStyle = '#00F0FF'; ctx.fillText('KALMAN_ESTIMATE', 50, 130);

            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}

// 9. GENERIC DATA PLOT
const DataPlotter = () => {
     const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let offset = 0;
        let animationFrame: number;

        const animate = () => {
            offset += 2;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let i=0; i<CANVAS_WIDTH; i+=100) { ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_HEIGHT); }
            for(let i=0; i<CANVAS_HEIGHT; i+=100) { ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); }
            ctx.stroke();

            // Data Lines
            ctx.lineWidth = 6;
            
            // Line 1 (Smooth)
            ctx.strokeStyle = '#00F0FF';
            ctx.beginPath();
            for(let x=0; x<CANVAS_WIDTH; x+=10) {
                const y = 500 + Math.sin((x + offset) * 0.01) * 200 + Math.sin((x + offset) * 0.02) * 100;
                if (x===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Line 2 (Noisy/High Freq)
            ctx.strokeStyle = '#FF4D00';
            ctx.beginPath();
            for(let x=0; x<CANVAS_WIDTH; x+=5) {
                const y = 600 + Math.sin((x + offset + 200) * 0.01) * 150 + (Math.random() - 0.5) * 50;
                if (x===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />;
}


// --- MAIN EXPORT COMPONENT ---

export const ProjectVisualizer: React.FC<VisualizerProps> = ({ projectId }) => {
  const getVisualizer = () => {
    switch (projectId) {
        // PROJECTS
        case 'mech-001': return <QuadrupedLeg />;
        case 'mech-002': return <ConveyorSystem />;
        case 'mech-003': return <VisionSystem />;
        case 'mech-004': return <FlightHorizon />;
        case 'mech-005': return <QuadrupedLeg />; 
        
        // LAB NOTES
        case 'note-001': return <SoftRoboticsSim />;
        case 'note-002': return <ROS2Network />;
        case 'note-003': return <TopologyOptimizer />;
        case 'note-004': return <KalmanFilterVis />;
        
        // DEFAULT
        default: return <DataPlotter />;
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden flex flex-col">
         {/* Terminal Header */}
         <div className="h-10 bg-[#111] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
             <div className="flex items-center gap-3">
                 <Activity size={14} className="text-secondary animate-pulse" />
                 <span className="text-xs font-mono text-gray-400">LIVE_SIMULATION // {projectId.toUpperCase()}</span>
             </div>
             <div className="flex gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
             </div>
         </div>
         
         {/* Main Viewport */}
         <div className="flex-1 relative w-full h-full overflow-hidden">
             {/* Grid Overlay */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-10" />
             
             {/* Canvas Render */}
             {getVisualizer()}
             
             {/* HUD Elements */}
             <div className="absolute bottom-6 left-6 font-mono text-xs text-primary/70 z-20">
                 CPU_USAGE: {Math.floor(Math.random() * 20 + 10)}%<br/>
                 FPS: 60
             </div>
         </div>
    </div>
  );
};