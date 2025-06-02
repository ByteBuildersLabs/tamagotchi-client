import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type {
  Engine,
  IOptions,
  RecursivePartial,
} from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

function MagicalSparkleParticles(): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine))
      .then(() => setEngineLoaded(true));
  }, []);

  const options = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#FFD700", "#FFEF94", "#FFF8DC", "#E6E6FA", "#F0E68C", "#98FB98"]
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          direction: MoveDirection.none,
          random: true,
          speed: { min: 0.3, max: 1.2 },
          straight: false,
          outModes: {
            default: OutMode.out,
          },
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 600,
          },
          path: {
            enable: true,
            options: {
              sides: 6,
              turnSteps: 30,
              angle: 30,
            },
          },
        },
        number: {
          value: 40,
          density: {
            enable: true,
            area: 1000,
          },
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: { min: 0.5, max: 2 },
            minimumValue: 0.1,
            sync: false,
          },
        },
        shape: {
          type: ["circle", "star"],
          options: {
            star: {
              sides: 4,
            },
          },
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: { min: 1, max: 3 },
            minimumValue: 0.5,
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.08,
            opacity: 1,
          },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 5, max: 15 },
            sync: false,
          },
        },
      },
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "attract",
          },
          resize: {
            enable: true,
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
      },
    }),
    []
  );

  if (!engineLoaded) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Particles
        id="magical-sparkles"
        className="w-full h-full"
        options={options}
      />
    </div>
  );
}

export default React.memo(MagicalSparkleParticles);
