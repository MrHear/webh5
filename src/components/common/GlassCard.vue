<template>
  <div 
    class="relative bg-white/70 dark:bg-[#1a1a1c]/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/5 p-6 transition-all duration-300 shadow-sm"
    :class="{ 
      'cursor-pointer hover:shadow-lg hover:bg-white/80 dark:hover:bg-[#1a1a1c]/80 hover:-translate-y-1': hoverable
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false
})
</script>
