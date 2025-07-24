import React, { useRef, Suspense, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

// Dragon component following fightclub pattern with enhanced error handling and animations
const DragonModel = ({ animationTrigger, ...props }: { animationTrigger?: number }) => {
  const group = useRef();
  const [modelState, setModelState] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  // Try to load GLB model with enhanced error handling
  let scene = null;
  let animations = null;
  let hasError = false;
  
  try {
    console.log("🐉 Attempting to load dragon GLB...");
    const gltf = useGLTF("./models/dragon.glb");
    scene = gltf.scene;
    animations = gltf.animations;
    console.log("🐉 Dragon GLB loaded successfully:", gltf);
    console.log("🐉 Dragon animations found:", animations?.map(anim => anim.name) || 'No animations');
    
    if (modelState === 'loading') {
      setModelState('loaded');
    }
  } catch (error) {
    console.error("🐉 Error loading dragon GLB:", error);
    hasError = true;
    if (modelState !== 'error') {
      setModelState('error');
    }
  }
  
  // Clone the scene to create independent instances (fightclub pattern)
  const clonedScene = useMemo(() => {
    if (!scene || hasError || modelState === 'error') {
      console.log("🐉 No scene available, will use placeholder");
      return null;
    }
    
    try {
      console.log("🐉 Cloning dragon scene...");
      const cloned = SkeletonUtils.clone(scene);
      
      // Calculate bounding box for precise centering (from fightclub CharacterPreview)
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      console.log("🐉 Dragon model bounds:", { center, size });
      
      // Center the model perfectly at origin
      cloned.position.set(-center.x, -center.y, -center.z);
      
      // Adjust position to show dragon nicely centered
      cloned.position.y = -box.min.y + (size.y * 0.1);
      
      // Scale to fit display area
      const maxSize = Math.max(size.x, size.y, size.z);
      let scale = 1;
      if (maxSize > 2) {
        scale = 2 / maxSize;
        cloned.scale.setScalar(scale);
      }
      
      console.log("🐉 Dragon model processed successfully, scale:", scale);
      return cloned;
    } catch (error) {
      console.error("🐉 Error processing dragon model:", error);
      setModelState('error');
      return null;
    }
  }, [scene, hasError, modelState]);

  // Animation handling (following fightclub pattern)
  const { actions, names } = useAnimations(animations || [], group);
  
  // Play idle animation if available
  useEffect(() => {
    if (actions && names && names.length > 0) {
      console.log("🎭 Dragon animations available:", names);
      console.log("🎭 Actions object:", actions);
      
      // Just use the first animation as idle (simple approach)
      const idleAnimationName = names[0];
      console.log("🎭 Using animation for idle:", idleAnimationName);
      console.log("🎭 Action for this animation:", actions[idleAnimationName]);
      
      if (idleAnimationName && actions[idleAnimationName]) {
        // Stop all other animations first (fightclub pattern)
        Object.values(actions).forEach(action => {
          if (action) {
            console.log("🎭 Stopping action:", action);
            action.stop();
          }
        });
        
        // Play the animation in loop (fightclub pattern)
        const action = actions[idleAnimationName];
        if (action) {
          console.log("🎭 Setting up animation...");
          console.log("🎭 Action details:", {
            duration: action.getClip().duration,
            time: action.time,
            enabled: action.enabled,
            paused: action.paused
          });
          
          // Ensure the action is properly configured
          action.enabled = true;
          action.paused = false;
          action.reset();
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          
          // Force immediate start
          action.time = 0;
          action.weight = 1;
          
          console.log("🎭 Dragon idle animation configured and started:", idleAnimationName);
          console.log("🎭 Animation state after start:", {
            isRunning: action.isRunning(),
            time: action.time,
            enabled: action.enabled,
            paused: action.paused,
            weight: action.weight
          });
          
          return () => {
            console.log("🎭 Cleaning up animation");
            if (actions[idleAnimationName]) {
              actions[idleAnimationName]?.stop();
            }
          };
        }
      } else {
        console.warn("🎭 No dragon animations found or action not available");
        console.warn("🎭 Names:", names);
        console.warn("🎭 Actions:", actions);
      }
    } else {
      console.warn("🎭 No actions, names, or empty arrays:", { actions, names });
    }
  }, [actions, names, animationTrigger]);

  console.log("🐉 DragonModel render - modelState:", modelState, "hasError:", hasError, "clonedScene:", !!clonedScene);

  // Use placeholder if model fails or doesn't exist
  if (modelState === 'error' || hasError || !clonedScene) {
    console.log("🐉 Using placeholder dragon");
    return <DragonPlaceholder />;
  }

  console.log("🐉 Rendering real dragon model");
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Enhanced dragon placeholder with animation (following fightclub animation patterns)
const DragonPlaceholder = () => {
  const groupRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  
  // Animate dragon placeholder (similar to fightclub character animations)
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

// Loading fallback component (fightclub style)
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

// Simple test component to verify GLB loading
const SimpleDragonTest = () => {
  const group = useRef();
  
  try {
    console.log("🧪 Testing simple dragon load...");
    const { scene, animations } = useGLTF("./models/dragon.glb");
    console.log("🧪 Simple dragon loaded:", scene);
    console.log("🧪 Simple dragon animations:", animations?.map(anim => anim.name) || 'No animations');
    
    // Add animations to simple test too
    const { actions, names } = useAnimations(animations || [], group);
    
    useEffect(() => {
      if (actions && names && names.length > 0) {
        const firstAnimation = names[0];
        console.log("🧪 Playing first animation:", firstAnimation);
        
        if (actions[firstAnimation]) {
          actions[firstAnimation].reset().play();
          actions[firstAnimation].setLoop(THREE.LoopRepeat, Infinity);
        }
      }
    }, [actions, names]);
    
    return (
      <group ref={group}>
        <primitive object={scene} scale={0.5} position={[0, 0, 0]} />
      </group>
    );
  } catch (error) {
    console.error("🧪 Simple dragon test failed:", error);
    return null;
  }
};

export const BeastHomeDisplay = () => {
  const [useSimpleTest, setUseSimpleTest] = useState(false);
  const [forceAnimation, setForceAnimation] = useState(0);
  
  // Add keyboard shortcut to toggle between models (for debugging)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        setUseSimpleTest(!useSimpleTest);
        console.log("🔄 Toggled to:", useSimpleTest ? "Complex Dragon" : "Simple Test");
      }
      if (e.key === 'a' || e.key === 'A') {
        setForceAnimation(prev => prev + 1);
        console.log("🎭 Forcing animation restart");
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [useSimpleTest]);

  return (
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      {/* Debug info */}
      <div className="absolute top-0 left-0 text-xs text-white bg-black bg-opacity-50 p-2 z-10">
        Mode: {useSimpleTest ? "Simple Test" : "Complex Dragon"} (Press 'T' to toggle)<br/>
        Press 'A' to force animation restart
      </div>
      
      <div className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          shadows
          style={{ width: "100%", height: "100%" }}
          onCreated={() => console.log("🎨 Canvas created successfully")}
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
          
          {/* Atmospheric accent lights */}
          <pointLight
            position={[1, -1, 2]}
            intensity={0.3}
            color="#4a90e2"
            distance={5}
          />
          
          <pointLight
            position={[-1, 3, -1]}
            intensity={0.25}
            color="#ff6b6b"
            distance={4}
          />
          
          {/* Dragon model with suspense for loading */}
          <Suspense fallback={<ModelFallback />}>
            {useSimpleTest ? <SimpleDragonTest /> : <DragonModel animationTrigger={forceAnimation} />}
          </Suspense>
          
          {/* Controls for interaction (fightclub pattern) */}
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

// Preload dragon model following fightclub pattern
const preloadDragonModel = () => {
  try {
    useGLTF.preload("./models/dragon.glb");
    console.log("🐉 Dragon GLB model preloaded successfully");
  } catch (error) {
    console.warn("🐉 Dragon GLB model not found, will use animated placeholder");
  }
};

// Delayed preload to avoid blocking initial render
setTimeout(preloadDragonModel, 100);