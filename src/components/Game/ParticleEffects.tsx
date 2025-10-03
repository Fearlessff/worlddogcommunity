import React from 'react';
import { useCallback } from "react";
import type { Engine } from "@tsparticles/engine";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface ParticleEffectsProps {
  type: 'win-x' | 'win-o' | 'draw' | 'background';
}

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ type }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getConfig = () => {
    switch (type) {
      case 'win-x':
        return {
          particles: {
            color: { value: "#00FFFF" },
            move: {
              direction: "top",
              enable: true,
              speed: 3,
            },
            number: { value: 40 },
            shape: { type: "star" },
            size: { value: 4 },
          },
          background: { enable: false }
        };
      case 'win-o':
        return {
          particles: {
            color: { value: "#FF8C00" },
            move: {
              direction: "top",
              enable: true,
              speed: 3,
            },
            number: { value: 40 },
            shape: { type: "circle" },
            size: { value: 4 },
          },
          background: { enable: false }
        };
      case 'draw':
        return {
          particles: {
            color: { value: ["#00FFFF", "#FF8C00"] },
            move: {
              direction: "none",
              enable: true,
              speed: 2,
            },
            number: { value: 30 },
            shape: { type: ["circle", "star"] },
            size: { value: 3 },
          },
          background: { enable: false }
        };
      case 'background':
        return {
          particles: {
            color: { value: "#2B5278" },
            move: {
              direction: "none",
              enable: true,
              speed: 0.5,
              random: true,
            },
            number: { value: 20 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: 2 },
            links: {
              enable: true,
              distance: 150,
              color: "#2B5278",
              opacity: 0.2,
            },
          },
          background: { enable: false }
        };
    }
  };

  return (
    <Particles
      id={`particles-${type}`}
      init={particlesInit}
      options={getConfig()}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

export default ParticleEffects;