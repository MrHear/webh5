<template>
  <div 
    class="glass-panel rounded-lg p-6"
    :class="{ 'cursor-pointer': hoverable }"
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

<style scoped>
/* 额外的玻璃卡片样式 */
</style>
