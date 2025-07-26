import React, { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import useAppStore from "../../zustand/store";

interface DragonDisplayProps {
  className?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  animationSpeed?: number;
  autoRotateSpeed?: number;
  lighting?: "bright" | "dim" | "sleep";
  triggerAction?: 'cleaning' | 'feeding' | 'sleeping' | 'wake' | 'happy' | 'sad' | 'jumping' | 'interaction' | 'dirty' | null;
  style?: React.CSSProperties;
}

// Simple dragon component - reusable across screens
const SimpleDragonModel = ({ 
  scale = 0.5, 
  position = [0, 0, 0], 
  animationSpeed = 1,
  rotation = [0, 0, 0],
  triggerAnimation = null
}: {
  scale?: number;
  position?: [number, number, number];
  animationSpeed?: number;
  rotation?: [number, number, number];
  triggerAnimation?: 'cleaning' | 'feeding' | 'sleeping' | 'wake' | 'happy' | 'sad' | 'jumping' | 'interaction' | 'dirty' | null;
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Get global sleeping state
  const realTimeStatus = useAppStore(state => state.realTimeStatus);
  const currentBeastAwakeStatus = realTimeStatus.length >= 4 ? Boolean(realTimeStatus[3]) : null;
  const isBeastSleeping = currentBeastAwakeStatus === false;
  
  try {
    const { scene, animations } = useGLTF("./3dBeasts/red.glb");
    
    // Clone scene for independent instance
    const clonedScene = useMemo(() => {
      if (!scene) return null;
      return SkeletonUtils.clone(scene);
    }, [scene]);
    
    const { actions, names } = useAnimations(animations || [], group);
    
    // Tamagotchi animation state management
    useEffect(() => {
      if (actions && names && names.length > 0) {
        console.info("🎭 Tamagotchi Animations:", names);
        
        // Define tamagotchi animation mappings
        const animationMap = {
          // Idle state animations (random rotation for lively behavior)
          idle: [
            'Standing_Idle',    // Base idle pose
            'Excited Waggle',   // Happy/energetic movement
            'Smiling',          // Content expression
            'Moving Around',    // Casual movement
            'Walk in circles'   // Playful behavior
          ],
          // Action animations (triggered by user interactions)
          cleaning: ['Cleaning'],
          feeding: ['Eating'], 
          sleeping: ['Sleeping', 'Laying Down'],
          // Interaction animations
          interaction: ['Interaction Response'],
          // Mood/State animations
          happy: ['Excited Waggle', 'Smiling', 'Jumping'],
          sad: ['Sad', 'Tired'],
          dirty: ['Dirty.001'],
          // Special actions
          jumping: ['Jumping'],
          laying: ['Laying Down']
        };
        
        // Filter available animations for each state
        const availableAnimations = {
          idle: animationMap.idle.filter(name => names.includes(name)),
          cleaning: animationMap.cleaning.filter(name => names.includes(name)),
          feeding: animationMap.feeding.filter(name => names.includes(name)),
          sleeping: animationMap.sleeping.filter(name => names.includes(name)),
          interaction: animationMap.interaction.filter(name => names.includes(name)),
          happy: animationMap.happy.filter(name => names.includes(name)),
          sad: animationMap.sad.filter(name => names.includes(name)),
          dirty: animationMap.dirty.filter(name => names.includes(name)),
          jumping: animationMap.jumping.filter(name => names.includes(name)),
          laying: animationMap.laying.filter(name => names.includes(name))
        };
        
        console.info("🎮 Available tamagotchi animations:", availableAnimations);
        
        let currentAction: THREE.AnimationAction | null = null;
        let idleInterval: NodeJS.Timeout | null = null;
        let currentState: 'idle' | 'action' | 'sleeping' = 'idle';
        
        // Function to stop current animation smoothly
        const stopCurrentAnimation = (fadeTime = 0.5) => {
          if (currentAction && currentAction.isRunning()) {
            currentAction.fadeOut(fadeTime);
          }
        };
        
        // Function to play animation by name
        const playAnimation = (animationName: string, loop = true, fadeInTime = 0.5) => {
          if (!names.includes(animationName)) {
            console.warn(`⚠️ Animation "${animationName}" not found`);
            return null;
          }
          
          const action = actions[animationName];
          if (action) {
            action.reset();
            action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
            action.timeScale = animationSpeed;
            action.play();
            action.fadeIn(fadeInTime);
            console.info(`✅ Playing: ${animationName} (loop: ${loop})`);
            return action;
          }
          return null;
        };
        
        // Function to play random idle animation
        const playRandomIdleAnimation = () => {
          // If beast is sleeping, force sleeping animation instead of idle
          if (isBeastSleeping && availableAnimations.sleeping.length > 0) {
            if (currentState !== 'sleeping') {
              console.info(`😴 Beast is sleeping globally, forcing sleeping animation`);
              currentState = 'sleeping';
              stopCurrentAnimation(0.8);
              setTimeout(() => {
                const sleepingAnimations = availableAnimations.sleeping;
                const randomIndex = Math.floor(Math.random() * sleepingAnimations.length);
                const selectedAnimation = sleepingAnimations[randomIndex];
                currentAction = playAnimation(selectedAnimation, true, 0.8);
              }, 800);
            }
            return;
          }
          
          // Regular idle behavior when awake
          if (currentState !== 'idle' || availableAnimations.idle.length === 0) return;
          
          stopCurrentAnimation(0.8);
          
          setTimeout(() => {
            // Double check state hasn't changed during timeout and beast is still awake
            if (currentState !== 'idle' || isBeastSleeping) return;
            
            const randomIndex = Math.floor(Math.random() * availableAnimations.idle.length);
            const selectedAnimation = availableAnimations.idle[randomIndex];
            currentAction = playAnimation(selectedAnimation, true, 0.8);
          }, 800);
        };
        
        // Function to play action animation
        const playActionAnimation = (actionType: 'cleaning' | 'feeding' | 'sleeping' | 'wake' | 'happy' | 'sad' | 'jumping' | 'interaction' | 'dirty') => {
          // If beast is sleeping globally, ignore all actions except wake
          if (isBeastSleeping && actionType !== 'wake') {
            console.info(`😴 Beast is sleeping globally, ignoring ${actionType} action`);
            return;
          }
          
          // Handle wake action separately
          if (actionType === 'wake') {
            console.info(`🌅 Waking up beast, returning to idle`);
            currentState = 'idle';
            stopCurrentAnimation(0.5);
            setTimeout(() => {
              playRandomIdleAnimation();
              startIdleRotation();
            }, 500);
            return;
          }
          
          const actionAnimations = availableAnimations[actionType];
          if (actionAnimations.length === 0) {
            console.warn(`⚠️ No animations available for action: ${actionType}`);
            return;
          }
          
          console.info(`🎯 Triggering ${actionType} action`);
          currentState = 'action';
          
          // Stop idle interval
          if (idleInterval) {
            clearInterval(idleInterval);
            idleInterval = null;
          }
          
          // Stop current animation
          stopCurrentAnimation(0.5);
          
          setTimeout(() => {
            // Pick random animation for this action (some actions might have multiple animations)
            const randomIndex = Math.floor(Math.random() * actionAnimations.length);
            const selectedAnimation = actionAnimations[randomIndex];
            
            // Determine if animation should loop based on action type
            const shouldLoop = actionType === 'sleeping' || actionType === 'dirty';
            const loopDuration = shouldLoop ? 8000 : null; // 8 seconds for looping actions
            
            // Play action animation
            currentAction = playAnimation(selectedAnimation, shouldLoop, 0.5);
            
            if (currentAction) {
              // Special handling for sleeping - don't return to idle
              if (actionType === 'sleeping') {
                console.info(`😴 Beast is now sleeping, staying in sleep state`);
                currentState = 'sleeping'; // Keep in sleeping state
                // Don't set any timeout - stay sleeping until wake is triggered
                return;
              }
              
              // Calculate duration - use fixed duration for looping actions or animation duration for single actions
              const animationDuration = shouldLoop && loopDuration ? 
                loopDuration / 1000 : 
                (animations?.find(anim => anim.name === selectedAnimation)?.duration || 3);
              
              setTimeout(() => {
                console.info(`✅ ${actionType} action completed, returning to idle`);
                
                // For looping actions, fade out manually
                if (shouldLoop && currentAction) {
                  currentAction.fadeOut(0.5);
                }
                
                currentState = 'idle';
                
                // Return to idle after action completes
                setTimeout(() => {
                  playRandomIdleAnimation();
                  startIdleRotation();
                }, shouldLoop ? 500 : 300);
              }, animationDuration * 1000);
            }
          }, 500);
        };
        
        // Function to start idle animation rotation
        const startIdleRotation = () => {
          if (idleInterval) clearInterval(idleInterval);
          
          // Don't start idle rotation if beast is sleeping
          if (currentState === 'sleeping' || isBeastSleeping) return;
          
          idleInterval = setInterval(() => {
            // Check if still in idle state and awake before playing next animation
            if (currentState === 'idle' && !isBeastSleeping) {
              playRandomIdleAnimation();
            }
          }, Math.random() * 3000 + 4000); // 4-7 seconds
        };
        
        // Initialize with idle state
        currentState = 'idle';
        playRandomIdleAnimation();
        startIdleRotation();
        
        // Store functions for cleanup and external access
        const tamagotchiState = {
          playActionAnimation,
          stopCurrentAnimation,
          currentState,
          availableAnimations
        };
        
        // Store in ref for external access
        if (group.current) {
          (group.current as any).tamagotchiState = tamagotchiState;
        }
        
        // Cleanup function
        return () => {
          if (idleInterval) {
            clearInterval(idleInterval);
          }
          stopCurrentAnimation(0.3);
        };
      }
    }, [actions, names, animationSpeed, animations]);
    
    // Effect to handle changes in global sleeping state
    useEffect(() => {
      if (group.current && (group.current as any).tamagotchiState) {
        const { playRandomIdleAnimation, playActionAnimation } = (group.current as any).tamagotchiState;
        
        if (isBeastSleeping) {
          console.info(`😴 Global sleeping state detected, forcing sleeping animation`);
          playActionAnimation('sleeping');
        } else if (currentBeastAwakeStatus === true) {
          console.info(`🌅 Global awake state detected, returning to idle`);
          playActionAnimation('wake');
        }
      }
    }, [isBeastSleeping, currentBeastAwakeStatus]);
    
    // Effect to handle triggered actions
    useEffect(() => {
      if (triggerAnimation && group.current && (group.current as any).tamagotchiState) {
        const { playActionAnimation } = (group.current as any).tamagotchiState;
        playActionAnimation(triggerAnimation);
      }
    }, [triggerAnimation]);
    
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
  className = "h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-[360px] lg:w-[360px]",
  scale = 0.35,
  position = [0, -0.5, 0],
  animationSpeed = 1,
  autoRotateSpeed = 0.5,
  lighting = 'bright',
  style = {},
  rotation = [0, 0, 0], // Add rotation prop
  triggerAction = null // Add trigger animation prop
}) => {
  return (
    <div className={className} style={{ ...style, overflow: 'visible' }}>
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
            triggerAnimation={triggerAction}
          />
        </Suspense>
        
        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
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