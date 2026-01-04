<template>
  <Particles
    id="tsparticles"
    :particlesInit="particlesInit"
    :options="particlesOptions"
  />
</template>

<script setup lang="ts">
import { loadSlim } from "@tsparticles/slim"
import type { Engine } from "@tsparticles/engine"

const particlesInit = async (engine: Engine) => {
  await loadSlim(engine)
}

const particlesOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: ["#00f0ff", "#ff00ff", "#ffff00"],
    },
    links: {
      color: "#00f0ff",
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none" as const,
      random: false,
      straight: false,
      outModes: {
        default: "bounce" as const,
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
}
</script>

<style scoped>
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
