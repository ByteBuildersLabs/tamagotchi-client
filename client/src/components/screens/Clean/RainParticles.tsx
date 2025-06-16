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
  duration?: number; // duración en segundos
  onComplete?: () => void;
}

function RainParticles({ isActive, duration = 5, onComplete }: RainParticlesProps): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [showRain, setShowRain] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine))
      .then(() => setEngineLoaded(true));
  }, []);

  // Controla la activación y desactivación de la lluvia
  useEffect(() => {
    if (isActive) {
      setShowRain(true);
      
      // Timer para detener la lluvia después de la duración especificada
      const timer = setTimeout(() => {
        setShowRain(false);
        if (onComplete) {
          onComplete();
        }
      }, duration * 1000);

      return () => clearTimeout(timer);
    } else {
      setShowRain(false);
    }
  }, [isActive, duration, onComplete]);

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
          value: 150,
          density: {
            enable: true,
            area: 800,
          },
        },
        opacity: {
          value: { min: 0.4, max: 0.8 },
          animation: {
            enable: true,
            speed: { min: 1, max: 3 },
            minimumValue: 0.1,
            sync: false,
          },
        },
        shape: {
          type: "line",
          options: {
            line: {
              length: { min: 8, max: 20 },
            },
          },
        },
        size: {
          value: { min: 0.5, max: 1.5 },
          animation: {
            enable: false,
          },
        },
        stroke: {
          width: { min: 0.5, max: 1.2 },
        },
        rotate: {
          value: { min: 0, max: 10 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 1, max: 3 },
            sync: false,
          },
        },
        life: {
          duration: {
            sync: false,
            value: { min: 3, max: 7 },
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
      emitters: [
        {
          direction: MoveDirection.bottom,
          life: {
            count: 0,
            duration: duration,
            delay: 0,
          },
          rate: {
            delay: 0.01,
            quantity: 3,
          },
          position: {
            x: 50,
            y: -5,
          },
          size: {
            width: 100,
            height: 0,
          },
        },
      ],
    }),
    [duration]
  );

  if (!engineLoaded || !showRain) return null;

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