import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  // 打字机文本
  const typewriterText = ref('')
  const fullText = ref('Welcome to Digital Command Center - 探索数字世界的无限可能 🚀')
  
  // 打字机效果
  const startTypewriter = () => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.value.length) {
        typewriterText.value += fullText.value[index]
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)
  }

  // 主题切换
  const isDarkMode = ref(true)
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    typewriterText,
    fullText,
    startTypewriter,
    isDarkMode,
    toggleTheme
  }
})
