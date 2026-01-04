import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
// 引入图标库
import '@phosphor-icons/web/regular' 

import App from './App.vue'
import router from './router'
// ✅ 正确引入全局样式
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  }
})

app.mount('#app')