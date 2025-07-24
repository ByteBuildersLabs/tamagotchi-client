import React, { useRef, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Simple 3D Dragon placeholder component (until we can fix FBX loading)
const DragonPlaceholder = () => {
  const meshRef = useRef();
  
  return (
    <group>
      {/* Simple dragon-like shape made with basic geometries */}
      {/* Body */}
      <mesh position={[0, 0, 0]} ref={meshRef}>
        <capsuleGeometry args={[0.4, 1.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0.2]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#5ba3f5" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.6, 0.2, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#3a7bc8" />
      </mesh>
      <mesh position={[0.6, 0.2, -0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#3a7bc8" />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, -0.8, -0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.8]} />
        <meshStandardMaterial color="#2d5c87" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.9, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 0.9, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Loading fallback component
const ModelFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#666" />
  </mesh>
);

export const BeastHomeDisplay = () => {
  return (
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <div className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[2, 4, 2]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight
            position={[-1, 2, 1]}
            intensity={0.3}
            color="#4a90e2"
          />
          
          {/* Dragon placeholder with suspense for loading */}
          <Suspense fallback={<ModelFallback />}>
            <DragonPlaceholder />
          </Suspense>
          
          {/* Controls for interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>
    </div>
  );
};