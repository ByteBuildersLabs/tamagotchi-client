import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type {
  Engine,
  IOptions,
  RecursivePartial,
} from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface MegaBurstParticlesProps {
  trigger: boolean;
  eggPosition?: { x: number; y: number };
  onComplete?: () => void;
}

function MegaBurstParticles({ 
  trigger, 
  eggPosition = { x: 50, y: 50 },
  onComplete 
}: MegaBurstParticlesProps): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine))
      .then(() => setEngineLoaded(true));
  }, []);

  // Activar mega-burst cuando se dispare el trigger
  useEffect(() => {
    if (trigger && engineLoaded) {
      console.log("🌟💥 MEGA-BURST DE DESTELLOS SATURADOS ACTIVADO!");
      setBurstActive(true);
      
      // Desactivar después de la duración completa
      const timeout = setTimeout(() => {
        setBurstActive(false);
        onComplete?.();
        console.log("✨ Mega-burst completado!");
      }, 4000); // 4 segundos para que termine todo el efecto

      return () => clearTimeout(timeout);
    }
  }, [trigger, engineLoaded, onComplete]);

  const options = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      
      particles: {
        number: {
          value: 0, // Solo usamos emitters
        },
        color: {
          value: [
            "#FFD700", // Dorado intenso
            "#FFFF00", // Amarillo puro
            "#FFF700", // Amarillo brillante
            "#FFFFFF", // Blanco brillante
            "#FFE135", // Amarillo dorado
            "#FFF59D"  // Amarillo suave
          ]
        },
        shape: {
          type: ["circle", "star"],
          options: {
            star: {
              sides: 5,
            },
          },
        },
        size: {
          value: { min: 6, max: 14 }, // Tamaños grandes variables
          animation: {
            enable: true,
            speed: { min: 3, max: 6 },
            minimumValue: 2,
            sync: false,
          },
        },
        opacity: {
          value: { min: 0.8, max: 1 },
          animation: {
            enable: true,
            speed: 4, // Twinkle rápido
            minimumValue: 0,
            sync: false,
            startValue: "max",
            destroy: "min"
          },
        },
        move: {
          enable: true,
          direction: MoveDirection.none, // Dispersión radial 360°
          speed: { min: 6, max: 12 }, // Velocidad alta
          straight: false,
          random: true,
          outModes: {
            default: OutMode.out,
          },
          gravity: {
            enable: true,
            acceleration: 0.5, // Gravedad ligera
          },
        },
        life: {
          duration: {
            sync: false,
            value: { min: 1.5, max: 2.5 }, // 2s promedio de duración
          },
          count: 1,
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 10, max: 25 },
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.7, // Twinkle muy frecuente
            opacity: 1,
          },
        },
        // Trail ligero para estelas
        trail: {
          enable: true,
          length: 4, // Estelas breves
          fillColor: {
            value: "#FFD700",
          },
        },
        // Stroke brillante para mayor saturación
        stroke: {
          width: { min: 1, max: 2 },
          color: {
            value: "#FFFFFF",
          },
          opacity: 0.9,
        },
      },

      // MEGA EMITTER - 350 partículas en burst
      emitters: burstActive ? [
        // Emitter principal - explosión masiva
        {
          direction: MoveDirection.none,
          rate: {
            quantity: 350, // 350 partículas en el burst principal
            delay: 0.02,
          },
          size: {
            width: 25,
            height: 25,
          },
          position: {
            x: eggPosition.x,
            y: eggPosition.y,
          },
          life: {
            count: 1,
            duration: 0.4, // Disparo durante 0.4s
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
              value: { min: 8, max: 16 }, // Más grandes para el burst
              animation: {
                enable: true,
                speed: 5,
                minimumValue: 3,
                sync: false,
              },
            },
            opacity: {
              value: { min: 0.9, max: 1 },
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 0,
                sync: false,
                startValue: "max",
                destroy: "min"
              },
            },
            life: {
              duration: {
                sync: false,
                value: { min: 2, max: 3 },
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
                value: "#FFFF00",
              },
            },
            color: {
              value: ["#FFD700", "#FFFF00", "#FFFFFF"] // Solo los más saturados
            },
          },
        },
        // Emitter secundario - ráfaga de follow-up
        {
          direction: MoveDirection.none,
          rate: {
            quantity: 100,
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
            delay: 0.5, // Retardo para segunda oleada
          },
          particles: {
            move: {
              direction: MoveDirection.none,
              speed: { min: 10, max: 18 },
              outModes: {
                default: OutMode.out,
              },
            },
            size: {
              value: { min: 4, max: 12 },
            },
            opacity: {
              value: { min: 0.8, max: 1 },
              animation: {
                enable: true,
                speed: 4,
                minimumValue: 0,
                sync: false,
                startValue: "max",
                destroy: "min"
              },
            },
            shape: {
              type: ["star", "circle"],
              options: {
                star: {
                  sides: 6, // Estrellas de 6 puntas para variedad
                },
              },
            },
            color: {
              value: ["#FFFFFF", "#FFF700", "#FFE135"], // Colores más brillantes
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.9,
                opacity: 1,
              },
            },
          },
        }
      ] : undefined,

      detectRetina: true,
    }),
    [burstActive, eggPosition.x, eggPosition.y]
  );

  if (!engineLoaded || !burstActive) return null;

  return (
    <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
      <Particles
        id={`mega-burst-${Date.now()}`}
        className="w-full h-full"
        options={options}
      />
    </div>
  );
}

export default React.memo(MegaBurstParticles);