import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing JSX.IntrinsicElements types for R3F components
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      octahedronGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      fog: any;
      perspectiveCamera: any;
      // Allow other R3F elements dynamically
      [elemName: string]: any;
    }
  }
}

const CoreGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
        // Floating sway
        groupRef.current.rotation.y = Math.sin(t / 4) * 0.1;
        groupRef.current.rotation.z = Math.cos(t / 4) * 0.1;
    }

    if (outerRingRef.current) outerRingRef.current.rotation.x = t * 0.2;
    if (midRingRef.current) midRingRef.current.rotation.y = t * 0.3;
    if (innerRingRef.current) innerRingRef.current.rotation.z = t * 0.4;
  });

  return (
    <group ref={groupRef}>
      {/* Central Artifact */}
      <Float speed={5} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color="#000" 
            roughness={0.1}
            metalness={1}
            emissive="#FF4D00"
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.79, 0]} />
          <meshStandardMaterial color="#000" roughness={0.2} metalness={1} />
        </mesh>
      </Float>

      {/* Gyro Rings */}
      <group>
        <mesh ref={innerRingRef}>
            <torusGeometry args={[1.8, 0.02, 16, 100]} />
            <meshStandardMaterial color="#404040" metalness={1} roughness={0.1} />
        </mesh>
        <mesh ref={midRingRef}>
            <torusGeometry args={[2.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#606060" metalness={1} roughness={0.1} />
            {/* Tech Markers on Ring */}
            <mesh position={[2.2, 0, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color="#FF4D00" />
            </mesh>
        </mesh>
        <mesh ref={outerRingRef}>
            <torusGeometry args={[2.6, 0.05, 16, 100]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Energy Field Lines */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
         <torusGeometry args={[4, 0.01, 16, 100]} />
         <meshBasicMaterial color="#00F0FF" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

const BackgroundParticles = () => {
    return (
        <group>
            <Sparkles 
                count={150}
                scale={12}
                size={2}
                speed={0.4}
                opacity={0.5}
                color="#FF4D00"
            />
             <Sparkles 
                count={150}
                scale={15}
                size={2}
                speed={0.2}
                opacity={0.3}
                color="#00F0FF"
            />
        </group>
    )
}

const Rig = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    // Use a ref to track mouse position independently of R3F events
    // This allows us to disable pointer events on the canvas completely
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse position to -1 to 1 range
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (cameraRef.current) {
            // Smoothly interpolate camera position based on mouse ref
            const x = mouse.current.x * 0.5;
            const y = mouse.current.y * 0.5;
            cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, x, 0.05);
            cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, y, 0.05);
            cameraRef.current.lookAt(0, 0, 0);
        }
    })
    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={35} />
}

export const Scene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) setHasWebGL(false);
    } catch (e) {
        setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        dpr={[1, 1.5]} 
        style={{ pointerEvents: 'none' }} // CRITICAL: Disables all pointer interaction on the canvas DOM element
        gl={{ 
            antialias: false,
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 1.5,
            alpha: true,
            stencil: false,
            depth: true,
            powerPreference: "default"
        }}
        onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                console.warn('WebGL Context Lost');
            }, false);
        }}
      >
        <Rig />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00F0FF" />
        <pointLight position={[-10, -5, -10]} intensity={4} color="#FF4D00" />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.5} penumbra={1} color="#ffffff" />
        
        <CoreGeometry />
        <BackgroundParticles />
        
        <Environment preset="city" />
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};