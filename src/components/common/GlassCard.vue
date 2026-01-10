<template>
  <div 
    class="relative bg-white dark:bg-[#1a1a1c] rounded-xl border border-gray-100 dark:border-white/5 p-6 transition-all duration-300"
    :class="{ 
      'cursor-pointer hover:shadow-md hover:border-indigo-100/50 dark:hover:border-white/10': hoverable,
      'shadow-[0_2px_8px_rgba(0,0,0,0.02)]': true
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
