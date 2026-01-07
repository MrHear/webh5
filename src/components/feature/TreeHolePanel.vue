<template>
  <div class="animate-fade-in">
    <!-- 头部 -->
    <header class="mb-8 flex justify-between items-end border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
          <i class="ph ph-tree-evergreen text-emerald-600"></i> 树洞
        </h2>
        <p class="text-sm text-gray-400 mt-1">带上面具，说出你的真心话。</p>
      </div>
      <div class="text-right hidden sm:block">
        <div class="text-xs text-gray-400 mb-1">当前身份</div>
        <div class="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors" @click="regenerateIdentity">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-sm font-bold text-gray-700">{{ currentIdentity }}</span>
          <i class="ph ph-arrows-clockwise text-gray-400"></i>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- 左侧：话题区 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 每日话题卡片 -->
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
           <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
             <i class="ph ph-fire"></i> Daily Topic
           </div>
           <h3 class="text-xl md:text-2xl font-serif text-gray-900 leading-snug mb-4">
             "你最近一次感到孤独是什么时候？"
           </h3>
           <div class="flex items-center justify-between">
             <div class="flex -space-x-2">
               <div v-for="n in 4" :key="n" class="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
             </div>
             <button class="text-sm font-medium text-emerald-700 hover:text-emerald-900">参与讨论 &rarr;</button>
           </div>
        </div>

        <!-- 留言流 -->
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
             <div class="flex justify-between items-start mb-3">
               <div class="flex items-center gap-2">
                 <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-lg">
                   {{ ['👻', '👽', '🐱'][i-1] }}
                 </div>
                 <div>
                   <div class="text-sm font-bold text-gray-800">{{ ['迷路的诗人', '深海的鱼', '屋顶的猫'][i-1] }}</div>
                 </div>
               </div>
               <span class="text-xs text-gray-300">{{ i * 10 }}分钟前</span>
             </div>
             <p class="text-gray-600 text-sm leading-relaxed">
               {{ ['大概是昨天下班回家，看到路灯下的影子只有自己的时候吧。', '并不觉得孤独，反而很享受这种没有社交压力的时刻。一个人听歌，一个人吃饭，自在。', '同意楼上，孤独是成长的必修课。'][i-1] }}
             </p>
             <div class="mt-3 flex gap-4 text-gray-400 text-xs">
               <button class="hover:text-emerald-600 flex items-center gap-1"><i class="ph ph-heart"></i> {{ 12 - i }}</button>
               <button class="hover:text-gray-600 flex items-center gap-1"><i class="ph ph-chat-circle"></i> 回复</button>
             </div>
          </div>
        </div>
      </div>

      <!-- 右侧：发布区 (桌面端) -->
      <div class="lg:col-span-1">
        <div class="sticky top-8 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-4">投递心声</h3>
          <textarea 
            class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all resize-none mb-3"
            rows="4"
            placeholder="在这里写下你的秘密..."
          ></textarea>
          <div class="flex justify-between items-center">
            <button class="text-gray-400 hover:text-gray-600"><i class="ph ph-image text-lg"></i></button>
            <button class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
              发布
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentIdentity = ref('迷路的诗人')
const adjectives = ['迷路的', '失眠的', '快乐的', '忧郁的', '飞翔的', '沉默的', '流浪的']
const nouns = ['诗人', '宇航员', '猫', '仙人掌', '信差', '过客', '鲸鱼']

const regenerateIdentity = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]!
  const noun = nouns[Math.floor(Math.random() * nouns.length)]!
  currentIdentity.value = adj + noun
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>