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

  // Activate mega-burst when the trigger fires
  useEffect(() => {
    if (trigger && engineLoaded) {
      console.log("🌟💥 MEGA-BURST OF SATURATED SPARKLES ACTIVATED!");
      setBurstActive(true);

      // Deactivate after the full duration
      const timeout = setTimeout(() => {
        setBurstActive(false);
        onComplete?.();
        console.log("✨ Mega-burst completed!");
      }, 3000); // 3 seconds for the whole effect

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
          value: 0, // We only use emitters
        },
        color: {
          value: [
            "#FFD700", // Intense gold
            "#FFFF00", // Pure yellow
            "#FFF700", // Bright yellow
            "#FFFFFF", // Bright white
            "#FFE135", // Golden yellow
            "#FFF59D"  // Soft yellow
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
          value: { min: 6, max: 14 }, // Large variable sizes
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
            speed: 4, // Fast twinkle
            minimumValue: 0,
            sync: false,
            startValue: "max",
            destroy: "min"
          },
        },
        move: {
          enable: true,
          direction: MoveDirection.none, // 360° radial dispersion
          speed: { min: 6, max: 12 }, // High speed
          straight: false,
          random: true,
          outModes: {
            default: OutMode.out,
          },
          gravity: {
            enable: true,
            acceleration: 0.5, // Light gravity
          },
        },
        life: {
          duration: {
            sync: false,
            value: { min: 1.5, max: 2.5 }, // 2s average duration
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
            frequency: 0.7, // Very frequent twinkle
            opacity: 1,
          },
        },
        // Light trail for streaks
        trail: {
          enable: true,
          length: 4, // Short streaks
          fillColor: {
            value: "#FFD700",
          },
        },
        // Bright stroke for more saturation
        stroke: {
          width: { min: 1, max: 2 },
          color: {
            value: "#FFFFFF",
          },
          opacity: 0.9,
        },
      },

      // MEGA EMITTER - 350 particles in burst
      emitters: burstActive ? [
        // Main emitter - massive explosion
        {
          direction: MoveDirection.none,
          rate: {
            quantity: 350, // 350 particles in the main burst
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
            duration: 0.4, // Fires for 0.4s
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
              value: { min: 8, max: 16 }, // Larger for the burst
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
              value: ["#FFD700", "#FFFF00", "#FFFFFF"] // Only the most saturated
            },
          },
        },
        // Secondary emitter - follow-up burst
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
            delay: 0.5, // Delay for second wave
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
                  sides: 6, // 6-pointed stars for variety
                },
              },
            },
            color: {
              value: ["#FFFFFF", "#FFF700", "#FFE135"], // Brighter colors
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