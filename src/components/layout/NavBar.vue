<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3 cursor-pointer" @click="scrollToTop">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center shadow-lg shadow-cyber-primary/20">
            <i class="ph ph-planet text-2xl text-white"></i>
          </div>
          <h1 class="text-xl font-bold text-white tracking-wide">TreeHole</h1>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-white/70 hover:text-cyber-primary transition-colors">树洞</a>
          <a href="#timeline" class="text-white/70 hover:text-cyber-primary transition-colors">记忆流</a>
        </div>

        <!-- User Info -->
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border border-white/10">
            <i class="ph ph-user text-xl text-white/80"></i>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* 导航栏特定的模糊效果 */
nav {
  backdrop-filter: blur(20px);
}
</style>