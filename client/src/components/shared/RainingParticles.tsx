import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

function RainingParticles(): JSX.Element | null {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine((engine: Engine) => loadSlim(engine)).then(() => setEngineLoaded(true));
  }, []);

  const options = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        color: {
          value: "#ffffff", // White for raindrops
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          direction: MoveDirection.bottom, // Downward rain
          random: true,
          speed: { min: 5, max: 15 }, // Faster speed for rain
          straight: true, // Straight fall
          outModes: {
            default: OutMode.out, // Disappear when out of bounds
          },
        },
        number: {
          value: 200, // Dense rain
          density: {
            enable: true,
            area: 800,
          },
        },
        opacity: {
          value: 0.5, // Semi-transparent
          animation: {
            enable: false,
            minimumValue: 0.1,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "line", // Line shape for raindrops
          options: {
            line: {
              stroke: {
                color: "#ffffff",
                width: 1,
              },
            },
          },
        },
        size: {
          value: 5, // Consistent raindrop size
          animation: {
            enable: false,
            minimumValue: 0.1,
            speed: 40,
            sync: false,
          },
        },
        rotate: {
          value: 0,
          direction: "clockwise",
          animation: {
            enable: false,
            speed: 5,
            sync: false,
          },
        },
      },
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: false,
            mode: "repulse",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          repulse: {
            distance: 200,
            duration: 0.4,
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
        id="rain-particles"
        className="w-full h-full"
        options={options}
      />
    </div>
  );
}

export default React.memo(RainingParticles);