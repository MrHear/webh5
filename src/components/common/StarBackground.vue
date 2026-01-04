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
      value: "transparent", // 保持透明，让 CSS 动态背景透出来
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: ["#ffffff", "#00f0ff", "#9d00ff"], // 增加更多白色粒子，看起来更像星星
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: {
        default: "out" as const,
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80, // 稍微增加粒子数量
    },
    opacity: {
      value: { min: 0.2, max: 0.7 }, // 提高不透明度上限，更亮
      animation: {
        enable: true,
        speed: 1.5, // 呼吸速度加快一点
        sync: false
      }
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab"
      }
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.6
        }
      }
    }
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
  pointer-events: none;
}
</style>