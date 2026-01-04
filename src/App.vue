<template>
  <div 
    class="relative w-full min-h-screen overflow-hidden"
    @mousemove="handleMouseMove" 
    @mousedown="handleMouseDown" 
    @mouseup="handleMouseUp"
  >
    <!-- 移除了主光标和小圆点 -->

    <!-- 特效容器：容纳拖尾花朵和点击粒子 -->
    <div ref="effectsContainer" class="pointer-events-none fixed inset-0 z-[9998]"></div>
    
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 坐标状态
const effectsContainer = ref<HTMLElement | null>(null)

// 交互状态
const isActive = ref(false)

// 节流控制，防止花朵生成太密集
let lastTrailTime = 0
const trailInterval = 50 // 毫秒，越小花朵越密

const handleMouseMove = (e: MouseEvent) => {
  // 生成花朵拖尾
  const now = Date.now()
  if (now - lastTrailTime > trailInterval) {
    createFlowerTrail(e.clientX, e.clientY)
    lastTrailTime = now
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isActive.value = true
  createClickEffect(e.clientX, e.clientY)
}
const handleMouseUp = () => isActive.value = false

// 创建花朵拖尾
const flowers = ['🌸', '🌼', '🌺', '🌻', '🌹', '🌷', '✨'] // 花朵库

const createFlowerTrail = (x: number, y: number) => {
  if (!effectsContainer.value) return

  const flower = document.createElement('div')
  flower.classList.add('flower-trail')
  
  // 随机选一个花
  flower.innerText = flowers[Math.floor(Math.random() * flowers.length)]
  
  // 设置初始位置
  flower.style.left = `${x}px`
  flower.style.top = `${y}px`
  
  // 随机飘动方向 (微小的随机移动)
  const angle = Math.random() * 360
  const distance = 20 + Math.random() * 30
  const rotation = Math.random() * 90 - 45 // 旋转角度

  flower.style.setProperty('--tx', `${Math.cos(angle) * distance}px`)
  flower.style.setProperty('--ty', `${Math.sin(angle) * distance + 20}px`) // 稍微向下飘落
  flower.style.setProperty('--rot', `${rotation}deg`)

  effectsContainer.value.appendChild(flower)

  // 动画结束后移除
  flower.addEventListener('animationend', () => {
    flower.remove()
  })
}

// 点击特效 (保持不变)
const createClickEffect = (x: number, y: number) => {
  if (!effectsContainer.value) return

  const particleCount = 12 
  const colors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24'] 

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.classList.add('click-particle')
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    
    const angle = (i / particleCount) * 360 + Math.random() * 30
    const velocity = 20 + Math.random() * 40
    
    particle.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * velocity}px`)
    particle.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * velocity}px`)
    
    const size = 4 + Math.random() * 4
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    effectsContainer.value.appendChild(particle)

    particle.addEventListener('animationend', () => {
      particle.remove()
    })
  }
}
</script>

<style>
/* 确保 App 占满全屏 */
html, body, #app {
  height: 100%;
  margin: 0;
}
/* 这里 cursor: none 取决于你是否想完全隐藏系统鼠标 */
/* html, body { cursor: none; } */
</style>