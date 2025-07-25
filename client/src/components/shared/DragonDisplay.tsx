import React, { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

interface DragonDisplayProps {
  className?: string;
  scale?: number;
  position?: [number, number, number];
  animationSpeed?: number;
  autoRotateSpeed?: number;
  lighting?: 'bright' | 'dim' | 'sleep';
  style?: React.CSSProperties;
  rotation?: [number, number, number]; // Add rotation prop
}

// Simple dragon component - reusable across screens
const SimpleDragonModel = ({ 
  scale = 0.5, 
  position = [0, 0, 0], 
  animationSpeed = 1,
  rotation = [0, 0, 0]
}: {
  scale?: number;
  position?: [number, number, number];
  animationSpeed?: number;
  rotation?: [number, number, number];
}) => {
  const group = useRef<THREE.Group>(null);
  
  try {
    const { scene, animations } = useGLTF("./3dBeasts/red.glb");
    
    // Clone scene for independent instance
    const clonedScene = useMemo(() => {
      if (!scene) return null;
      return SkeletonUtils.clone(scene);
    }, [scene]);
    
    const { actions, names } = useAnimations(animations || [], group);
    
    useEffect(() => {
      if (actions && names && names.length > 0) {
        // Only show animation names list
        console.info("🎭 Red Beast Animations:", names);
        
        // Play first available animation
        const firstAnimation = names[0];
        
        if (actions[firstAnimation]) {
          actions[firstAnimation].reset().play();
          actions[firstAnimation].setLoop(THREE.LoopRepeat, Infinity);
          actions[firstAnimation].timeScale = animationSpeed;
        }
      }
    }, [actions, names, animationSpeed]);
    
    if (!clonedScene) {
      return <DragonPlaceholder scale={scale} position={position} />;
    }
    
    return (
      <group ref={group} rotation={rotation}>
        <primitive object={clonedScene} scale={scale} position={position} />
      </group>
    );
  } catch (error) {
    return <DragonPlaceholder scale={scale} position={position} />;
  }
};

// Dragon placeholder with customizable animations
const DragonPlaceholder = ({ 
  scale = 0.5, 
  position = [0, 0, 0] 
}: {
  scale?: number;
  position?: [number, number, number];
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  
  // Animate dragon placeholder
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.1;
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
    <group ref={groupRef} position={position}>
      {/* Dragon body with gradient material */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4 * scale, 1.2 * scale]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          metalness={0.3}
          roughness={0.7}
          emissive="#1a3f66"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Dragon head */}
      <mesh position={[0, 0.8 * scale, 0.2 * scale]}>
        <sphereGeometry args={[0.3 * scale]} />
        <meshStandardMaterial 
          color="#5ba3f5" 
          metalness={0.2}
          roughness={0.6}
          emissive="#2d5c87"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Left wing with animation */}
      <mesh ref={wingLeftRef} position={[-0.6 * scale, 0.2 * scale, -0.1 * scale]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8 * scale, 0.1 * scale, 0.4 * scale]} />
        <meshStandardMaterial 
          color="#3a7bc8" 
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Right wing with animation */}
      <mesh ref={wingRightRef} position={[0.6 * scale, 0.2 * scale, -0.1 * scale]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8 * scale, 0.1 * scale, 0.4 * scale]} />
        <meshStandardMaterial 
          color="#3a7bc8" 
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Tail with animation */}
      <mesh ref={tailRef} position={[0, -0.8 * scale, -0.2 * scale]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15 * scale, 0.8 * scale]} />
        <meshStandardMaterial 
          color="#2d5c87" 
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      
      {/* Eyes with glow effect */}
      <mesh position={[-0.1 * scale, 0.9 * scale, 0.4 * scale]}>
        <sphereGeometry args={[0.05 * scale]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.1 * scale, 0.9 * scale, 0.4 * scale]}>
        <sphereGeometry args={[0.05 * scale]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Dragon spikes along the back */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, (0.3 - i * 0.3) * scale, -0.3 * scale]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.05 * scale, 0.2 * scale]} />
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

// Lighting presets for different screens
const LightingSetup = ({ lighting = 'bright' }: { lighting: 'bright' | 'dim' | 'sleep' }) => {
  switch (lighting) {
    case 'bright':
      return (
        <>
          {/* Bright lighting for Home screen */}
          <ambientLight intensity={0.6} color="#ffffff" />
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
          <directionalLight
            position={[-2, 3, 2]}
            intensity={0.8}
            color="#f0f8ff"
          />
          <pointLight
            position={[2, 2, 3]}
            intensity={0.8}
            color="#ffffff"
            distance={10}
          />
          <pointLight
            position={[-2, 1, -1]}
            intensity={0.6}
            color="#87ceeb"
            distance={8}
          />
          <pointLight
            position={[0, -2, 2]}
            intensity={0.4}
            color="#e6f3ff"
            distance={6}
          />
        </>
      );
    
    case 'sleep':
      return (
        <>
          {/* Softer lighting for sleep atmosphere */}
          <ambientLight intensity={0.8} color="#b8c5ff" />
          <directionalLight
            position={[2, 3, 2]}
            intensity={1.0}
            color="#e6f0ff"
          />
          <pointLight
            position={[-1, 1, 1]}
            intensity={0.6}
            color="#d0d8ff"
            distance={8}
          />
        </>
      );
    
    case 'dim':
    default:
      return (
        <>
          {/* Standard lighting for other screens */}
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight
            position={[2, 4, 2]}
            intensity={0.8}
            color="#ffffff"
          />
          <pointLight
            position={[1, 2, 2]}
            intensity={0.4}
            color="#ffffff"
            distance={8}
          />
        </>
      );
  }
};

// Main reusable Dragon Display component
export const DragonDisplay: React.FC<DragonDisplayProps> = ({
  className = "h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]",
  scale = 0.5,
  position = [0, 0, 0],
  animationSpeed = 1,
  autoRotateSpeed = 0.5,
  lighting = 'bright',
  style = {},
  rotation = [0, 0, 0] // Add rotation prop
}) => {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Dynamic lighting based on screen */}
        <LightingSetup lighting={lighting} />
        
        {/* Dragon model */}
        <Suspense fallback={<ModelFallback />}>
          <SimpleDragonModel 
            scale={scale}
            position={position}
            animationSpeed={animationSpeed}
            rotation={rotation}
          />
        </Suspense>
        
        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={autoRotateSpeed}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
};

// Preload dragon model
const preloadDragonModel = () => {
  try {
    useGLTF.preload("./3dBeasts/red.glb");
  } catch (error) {
    // Silent preload failure
  }
};

// Delayed preload to avoid blocking initial render
setTimeout(preloadDragonModel, 100); 