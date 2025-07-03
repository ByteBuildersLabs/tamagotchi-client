import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type {
  Engine,
  IOptions,
  RecursivePartial,
} from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface RainParticlesProps {
  isActive: boolean;
  duration: number; // in seconds
  onComplete?: () => void;
}

function RainParticles({ isActive, duration, onComplete }: RainParticlesProps): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine))
      .then(() => setEngineLoaded(true));
  }, []);

  // Respond to isActive changes
  useEffect(() => {
    // Only call onComplete when rain stops (not when it starts)
    if (!isActive && onComplete) {
      onComplete();
    }
  }, [isActive, onComplete]);

  const rainOptions = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#87CEEB", "#B0E0E6", "#E0F6FF", "#F0F8FF", "#DDEEFF"]
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          direction: MoveDirection.bottom,
          random: false,
          speed: { min: 8, max: 15 },
          straight: true,
          outModes: {
            default: OutMode.out,
            bottom: OutMode.out,
            left: OutMode.out,
            right: OutMode.out,
            top: OutMode.none,
          },
          angle: {
            offset: 0,
            value: 90,
          },
          gravity: {
            enable: true,
            acceleration: 2,
            maxSpeed: 20,
          },
        },
        number: {
          value: 80,
          density: {
            enable: false,
          },
        },
        opacity: {
          value: { min: 0.5, max: 0.9 },
          animation: {
            enable: true,
            speed: { min: 1, max: 3 },
            minimumValue: 0.2,
            sync: false,
          },
        },
        shape: {
          type: "line",
          options: {
            line: {
              length: { min: 10, max: 25 },
            },
          },
        },
        size: {
          value: { min: 0.8, max: 2 },
          animation: {
            enable: false,
          },
        },
        stroke: {
          width: { min: 0.8, max: 1.5 },
        },
        rotate: {
          value: { min: -5, max: 5 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 2, max: 5 },
            sync: false,
          },
        },
        life: {
          duration: {
            sync: false,
            value: { min: 2, max: 4 },
          },
          count: 1,
        },
      },
      detectRetina: true,
      interactivity: {
        events: {
          resize: {
            enable: true,
          },
        },
      },
      emitters: {
        direction: MoveDirection.bottom,
        life: {
          count: 0,
          duration: duration * 1000,
          delay: 0,
        },
        rate: {
          delay: 0.1,
          quantity: 8,
        },
        position: {
          x: 50,
          y: 30,
        },
        size: {
          width: 25,
          height: 5,
        },
      },
    }),
    [duration]
  );

  // Show particles immediately when isActive is true
  if (!engineLoaded || !isActive) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      <Particles
        id="rain-particles"
        className="w-full h-full"
        options={rainOptions}
      />
    </div>
  );
}

export default React.memo(RainParticles);