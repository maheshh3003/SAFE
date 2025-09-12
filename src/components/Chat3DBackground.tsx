'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function WellnessOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.2}
      floatingRange={[0, 0.2]}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#a8c686"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.2}
          emissive="#a8c686"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[1]) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function Chat3DBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#b8a082" />
        
        <WellnessOrb />
        
        <FloatingSphere position={[-2, 1, -2]} color="#a8c686" />
        <FloatingSphere position={[2, -1, -1]} color="#8ba37f" />
        <FloatingSphere position={[-1, -2, -3]} color="#b8a082" />
        <FloatingSphere position={[1, 2, -2]} color="#6b7c5a" />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
