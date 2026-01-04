<template>
  <div class="relative w-full max-w-2xl mx-auto mb-16 group z-10">
    <!-- 装饰性光晕背景 -->
    <div class="absolute -inset-1 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
    
    <div class="glass-panel rounded-xl p-6 relative overflow-hidden">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 mt-1">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 flex items-center justify-center border border-white/10">
            <i class="ph ph-tree-evergreen text-xl text-cyber-primary"></i>
          </div>
        </div>
        
        <div class="flex-1">
          <label for="tree-hole" class="block text-sm font-medium text-gray-400 mb-2">
            告诉树洞你的秘密... <span class="text-xs text-gray-600">(Press Enter to send)</span>
          </label>
          <textarea
            id="tree-hole"
            v-model="content"
            rows="3"
            class="glass-input w-full rounded-lg p-3 text-gray-200 placeholder-gray-600 resize-none text-base"
            placeholder="今天发生了什么？或者是那个藏在心底的想法..."
            @keydown.enter.ctrl="submit"
          ></textarea>
          
          <div class="flex justify-between items-center mt-3">
            <div class="flex gap-2">
               <!-- 心情选择器 -->
               <button 
                 v-for="m in moods" 
                 :key="m"
                 @click="selectedMood = m"
                 class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                 :class="selectedMood === m ? 'bg-white/20 scale-110' : 'opacity-50 hover:opacity-100'"
               >
                 {{ m }}
               </button>
            </div>
            <button 
              @click="submit"
              class="cursor-pointer px-6 py-2 rounded-lg bg-cyber-primary/10 hover:bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2"
              :disabled="!content.trim()"
            >
              <i class="ph ph-paper-plane-right"></i>
              投递
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
const selectedMood = ref('🌟')
const moods = ['🌟', '😔', '😡', '🤔', '🎉']

const emit = defineEmits(['submit'])

const submit = () => {
  if (!content.value.trim()) return
  
  emit('submit', {
    content: content.value,
    mood: selectedMood.value,
    date: new Date().toISOString()
  })
  
  // 清空
  content.value = ''
  selectedMood.value = '🌟'
}
</script>