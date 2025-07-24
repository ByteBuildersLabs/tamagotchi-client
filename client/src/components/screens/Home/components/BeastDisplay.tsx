import React, { useRef, Suspense, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

// Simple dragon component - clean and straightforward
const SimpleDragonModel = () => {
  const group = useRef<THREE.Group>(null);
  
  try {
    const { scene, animations } = useGLTF("./models/dragon.glb");
    
    // Log available animations for debugging
    console.info("🐉 Dragon GLB Animations:", animations?.map(anim => ({
      name: anim.name,
      duration: anim.duration,
      tracks: anim.tracks.length
    })) || 'No animations found');
    
    // Clone scene for independent instance
    const clonedScene = useMemo(() => {
      if (!scene) return null;
      return SkeletonUtils.clone(scene);
    }, [scene]);
    
    const { actions, names } = useAnimations(animations || [], group);
    
    useEffect(() => {
      if (actions && names && names.length > 0) {
        console.info("🎭 Available animation names:", names);
        
        // Just play the first available animation
        const firstAnimation = names[0];
        console.info("🎭 Using animation:", firstAnimation);
        
        if (actions[firstAnimation]) {
          actions[firstAnimation].reset().play();
          actions[firstAnimation].setLoop(THREE.LoopRepeat, Infinity);
          console.info("✅ Animation started successfully:", firstAnimation);
        }
      }
    }, [actions, names]);
    
    if (!clonedScene) {
      return <DragonPlaceholder />;
    }
    
    return (
      <group ref={group}>
        <primitive object={clonedScene} scale={0.5} position={[0, 0, 0]} />
      </group>
    );
  } catch (error) {
    console.error("🐉 Dragon model loading failed:", error);
    return <DragonPlaceholder />;
  }
};

// Enhanced dragon placeholder with animation
const DragonPlaceholder = () => {
  const groupRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  
  // Animate dragon placeholder
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.1;
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
    
    if (wingLeftRef.current && wingRightRef.current) {
      // Wing flapping animation
      const wingFlap = Math.sin(time * 3) * 0.2;
      wingLeftRef.current.rotation.z = 0.3 + wingFlap;
      wingRightRef.current.rotation.z = -0.3 - wingFlap;
    }
    
    if (tailRef.current) {
      // Tail swaying animation
      tailRef.current.rotation.x = 0.3 + Math.sin(time * 1.5) * 0.2;
      tailRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Dragon body with gradient material */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4, 1.2]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          metalness={0.3}
          roughness={0.7}
          emissive="#1a3f66"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Dragon head */}
      <mesh position={[0, 0.8, 0.2]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#5ba3f5" 
          metalness={0.2}
          roughness={0.6}
          emissive="#2d5c87"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Left wing with animation */}
      <mesh ref={wingLeftRef} position={[-0.6, 0.2, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#3a7bc8" 
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Right wing with animation */}
      <mesh ref={wingRightRef} position={[0.6, 0.2, -0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#3a7bc8" 
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Tail with animation */}
      <mesh ref={tailRef} position={[0, -0.8, -0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.8]} />
        <meshStandardMaterial 
          color="#2d5c87" 
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      
      {/* Eyes with glow effect */}
      <mesh position={[-0.1, 0.9, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.1, 0.9, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Dragon spikes along the back */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0.3 - i * 0.3, -0.3]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.05, 0.2]} />
          <meshStandardMaterial 
            color="#1a3f66" 
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Loading fallback component
const ModelFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial 
      color="#666" 
      opacity={0.3} 
      transparent 
      wireframe
    />
  </mesh>
);

export const BeastHomeDisplay = () => {
  return (
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <div className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          {/* Enhanced lighting setup for better dragon visibility */}
          <ambientLight intensity={0.6} color="#ffffff" />
          
          {/* Main directional light */}
          <directionalLight
            position={[3, 5, 3]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={30}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Fill light from the opposite side */}
          <directionalLight
            position={[-2, 3, 2]}
            intensity={0.8}
            color="#f0f8ff"
          />
          
          {/* Key light for dragon details */}
          <pointLight
            position={[2, 2, 3]}
            intensity={0.8}
            color="#ffffff"
            distance={10}
          />
          
          {/* Rim light for dragon silhouette */}
          <pointLight
            position={[-2, 1, -1]}
            intensity={0.6}
            color="#87ceeb"
            distance={8}
          />
          
          {/* Bottom fill light to reduce harsh shadows */}
          <pointLight
            position={[0, -2, 2]}
            intensity={0.4}
            color="#e6f3ff"
            distance={6}
          />
          
          {/* Simple Dragon model with suspense for loading */}
          <Suspense fallback={<ModelFallback />}>
            <SimpleDragonModel />
          </Suspense>
          
          {/* Controls for interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </div>
    </div>
  );
};

// Preload dragon model
const preloadDragonModel = () => {
  try {
    console.log('🚀 Preloading dragon model...');
    useGLTF.preload("./models/dragon.glb");
    console.log('✅ Dragon model preloaded successfully');
  } catch (error) {
    console.warn('⚠️ Dragon model preload failed, will load on demand:', error);
  }
};

// Delayed preload to avoid blocking initial render
setTimeout(preloadDragonModel, 100);