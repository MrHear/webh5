<template>
  <div id="app" class="relative">
    <!-- 星空粒子背景 -->
    <StarBackground />
    
    <!-- 主要内容 -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import StarBackground from '@/components/common/StarBackground.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
