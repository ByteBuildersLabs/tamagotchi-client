import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type {
  Engine,
  IOptions,
  RecursivePartial,
} from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface UltimateBurstParticlesProps {
  intensity: number; // 0-100
  burst: boolean;
  eggPosition?: { x: number; y: number };
}

function UltimateBurstParticles({ 
  intensity, 
  burst, 
  eggPosition = { x: 50, y: 50 } 
}: UltimateBurstParticlesProps): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState(0);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine))
      .then(() => setEngineLoaded(true));
  }, []);

  // Actualizar intensidad progresiva
  useEffect(() => {
    setCurrentIntensity(intensity);
  }, [intensity]);

  // Activar burst final
  useEffect(() => {
    if (burst && engineLoaded) {
      console.log("🎆 ULTIMATE BURST PARTICLES EXPLOSION!");
      setBurstActive(true);
      
      // Desactivar después de la explosión
      const timeout = setTimeout(() => {
        setBurstActive(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [burst, engineLoaded]);

  const options = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      
      particles: {
        number: {
          value: burstActive ? 0 : Math.floor(currentIntensity / 10), // Progresivo hasta burst
        },
        color: {
          value: [
            "#FFD700", // Dorado clásico
            "#FFE680", // Dorado claro
            "#FFEF94", // Dorado suave
            "#FFF8DC", // Cornsilk
            "#F0E68C", // Khaki
            "#FFFFFF"  // Blanco puro para destellos
          ]
        },
        shape: {
          type: ["circle", "star"],
          options: {
            star: {
              sides: currentIntensity > 50 ? 5 : 4,
            },
          },
        },
        size: {
          value: { 
            min: Math.max(1, currentIntensity / 25),
            max: Math.max(3, currentIntensity / 12)
          },
          animation: {
            enable: true,
            speed: { min: 2, max: currentIntensity > 70 ? 8 : 4 },
            minimumValue: 0.5,
            sync: false,
          },
        },
        opacity: {
          value: { min: 0.4, max: Math.min(1, currentIntensity / 100 + 0.5) },
          animation: {
            enable: true,
            speed: currentIntensity > 80 ? 3 : 1,
            minimumValue: 0.1,
            sync: false,
          },
        },
        move: {
          enable: true,
          direction: MoveDirection.none,
          speed: { 
            min: Math.max(0.5, currentIntensity / 50),
            max: Math.max(2, currentIntensity / 25)
          },
          straight: false,
          random: true,
          outModes: {
            default: OutMode.out,
          },
          attract: {
            enable: currentIntensity > 60,
            rotateX: 600,
            rotateY: 600,
          },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 5, max: currentIntensity > 70 ? 25 : 15 },
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: currentIntensity > 30,
            frequency: Math.min(0.6, currentIntensity / 100),
            opacity: 1,
          },
        },
        // Trail effect para intensidad alta
        ...(currentIntensity > 70 && {
          trail: {
            enable: true,
            length: 3,
            fillColor: {
              value: "#FFD700",
            },
          },
        }),
        // Stroke brillante para intensidad muy alta
        ...(currentIntensity > 80 && {
          stroke: {
            width: { min: 1, max: 2 },
            color: {
              value: "#FFFFFF",
            },
            opacity: 0.8,
          },
        }),
      },

      // Emitters para el burst final
      emitters: burstActive ? [
        // Emitter principal - explosión central
        {
          direction: MoveDirection.none,
          rate: {
            quantity: 150,
            delay: 0.05,
          },
          size: {
            width: 20,
            height: 20,
          },
          position: {
            x: eggPosition.x,
            y: eggPosition.y,
          },
          life: {
            count: 1,
            duration: 0.3,
          },
          particles: {
            move: {
              direction: MoveDirection.none,
              speed: { min: 8, max: 15 },
              outModes: {
                default: OutMode.out,
              },
              gravity: {
                enable: true,
                acceleration: 1,
              },
            },
            size: {
              value: { min: 6, max: 15 },
              animation: {
                enable: true,
                speed: 4,
                minimumValue: 2,
                sync: false,
              },
            },
            opacity: {
              value: { min: 0.8, max: 1 },
              animation: {
                enable: true,
                speed: 1.5,
                minimumValue: 0,
                sync: false,
                startValue: "max",
                destroy: "min"
              },
            },
            life: {
              duration: {
                sync: false,
                value: { min: 2, max: 4 },
              },
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.8,
                opacity: 1,
              },
            },
            trail: {
              enable: true,
              length: 5,
              fillColor: {
                value: "#FFD700",
              },
            },
          },
        },
        // Emitter secundario - ráfaga retardada
        {
          direction: MoveDirection.none,
          rate: {
            quantity: 80,
            delay: 0.1,
          },
          size: {
            width: 15,
            height: 15,
          },
          position: {
            x: eggPosition.x,
            y: eggPosition.y,
          },
          life: {
            count: 1,
            duration: 0.2,
            delay: 0.3, // Retardo para segunda oleada
          },
          particles: {
            move: {
              direction: MoveDirection.none,
              speed: { min: 12, max: 20 },
              outModes: {
                default: OutMode.out,
              },
            },
            size: {
              value: { min: 4, max: 10 },
            },
            opacity: {
              value: { min: 0.9, max: 1 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0,
                sync: false,
                startValue: "max",
                destroy: "min"
              },
            },
            shape: {
              type: "star",
              options: {
                star: {
                  sides: 5,
                },
              },
            },
            color: {
              value: ["#FFFFFF", "#FFE680"],
            },
          },
        }
      ] : undefined,

      detectRetina: true,
      
      // Interactividad para atraer partículas al mouse durante intensidad alta
      interactivity: currentIntensity > 70 ? {
        events: {
          onHover: {
            enable: true,
            mode: "attract",
          },
        },
        modes: {
          attract: {
            distance: 100,
            duration: 0.4,
            easing: "ease-out-quad",
            factor: 3,
            maxSpeed: 10,
            speed: 1,
          },
        },
      } : undefined,
    }),
    [currentIntensity, burstActive, eggPosition.x, eggPosition.y]
  );

  if (!engineLoaded) return null;

  // Solo renderizar si hay intensidad o burst activo
  if (currentIntensity === 0 && !burstActive) return null;

  return (
    <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
      <Particles
        id={`ultimate-particles-${currentIntensity}-${burstActive}`}
        className="w-full h-full"
        options={options}
      />
    </div>
  );
}

export default React.memo(UltimateBurstParticles);