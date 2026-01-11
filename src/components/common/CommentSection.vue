<template>
  <div class="mt-16 pb-32 border-t border-gray-100 dark:border-white/5 pt-10">
    <!-- 头部工具栏 -->
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-xl font-light text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <i class="ph ph-chat-circle-text"></i>
        评论 <span class="text-sm text-slate-400 font-mono">({{ comments.length }})</span>
      </h3>

      <!-- 排序 -->
      <div class="flex gap-4">
        <button 
          @click="changeSort('time')"
          class="text-xs font-medium transition-colors flex items-center gap-1"
          :class="currentSort === 'time' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'"
        >
          <i class="ph ph-clock"></i> 最新
        </button>
        <button 
          @click="changeSort('likes')"
          class="text-xs font-medium transition-colors flex items-center gap-1"
          :class="currentSort === 'likes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'"
        >
          <i class="ph ph-fire"></i> 最热
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-6">
      <div v-if="loading" class="text-center py-10">
        <div class="inline-block w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-16">
        <div class="w-16 h-16 mx-auto bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <i class="ph ph-chat-teardrop text-2xl"></i>
        </div>
        <p class="text-slate-400 italic font-serif">暂无评论，来做第一个发言的人吧。</p>
      </div>

      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="group relative animate-fade-in pl-4 border-l-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors"
      >
        <div class="flex gap-4">
          <!-- 头像 -->
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 font-bold text-sm shadow-sm">
            {{ comment.author.charAt(0).toUpperCase() }}
          </div>
          
          <div class="flex-grow min-w-0">
            <!-- 用户信息 -->
            <div class="flex items-baseline justify-between mb-1">
              <span class="font-medium text-slate-700 dark:text-slate-300 text-sm">{{ comment.author }}</span>
              <span class="text-xs font-mono text-slate-400">{{ formatDate(comment.createdAt) }}</span>
            </div>

            <!-- 回复引用 -->
            <div v-if="comment.replyTo" class="mb-2 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded text-xs text-slate-500 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-700">
              <span class="font-medium text-indigo-500">@{{ comment.replyTo.author }}</span>: {{ comment.replyTo.content }}
            </div>

            <!-- 内容 -->
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm break-words whitespace-pre-wrap">
              {{ comment.content }}
            </p>

            <!-- 操作栏 -->
            <div class="flex items-center gap-4 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <button 
                @click="handleLike(comment)"
                class="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                :class="comment.isLiked ? 'text-pink-500' : 'text-slate-400'"
              >
                <i :class="comment.isLiked ? 'ph-fill ph-heart' : 'ph ph-heart'"></i>
                <span>{{ comment.likes || '赞' }}</span>
              </button>
              
              <button 
                @click="handleReply(comment)"
                class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-500 transition-colors"
              >
                <i class="ph ph-arrow-u-up-left"></i>
                <span>回复</span>
              </button>

              <!-- 删除按钮 (管理员可见) -->
              <button 
                v-if="authStore.isLoggedIn"
                @click="handleDelete(comment)"
                class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
                :disabled="deletingId === comment.id"
              >
                <i :class="deletingId === comment.id ? 'ph ph-spinner animate-spin' : 'ph ph-trash'"></i>
                <span>删除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部悬浮输入栏 (重构优化版) -->
  <div class="fixed bottom-6 left-0 right-0 z-50 px-4">
    <div class="max-w-4xl mx-auto">
      <div 
        class="bg-white/90 dark:bg-[#1a1a1c]/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 p-2 pl-3 transition-all duration-300 flex items-end gap-2"
        :class="{'ring-2 ring-indigo-500/20': isInputFocused}"
      >
        <!-- 回复提示 -->
        <div v-if="replyingTo" class="absolute bottom-full left-0 mb-2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg animate-fade-in">
          <span>回复 @{{ replyingTo.author }}</span>
          <button @click="cancelReply" class="hover:text-red-300"><i class="ph ph-x"></i></button>
        </div>

        <!-- 昵称头像/随机入口 -->
        <div class="flex-shrink-0 relative group self-center mb-1">
          <button 
            @click="handleRandomName"
            class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            title="更换随机昵称"
          >
            <i class="ph ph-dice-five"></i>
          </button>
        </div>

        <!-- 输入框容器 -->
        <div class="flex-grow flex flex-col justify-center min-h-[44px] py-1">
           <!-- 顶部：昵称输入区域 -->
           <input 
             v-model="newComment.author"
             type="text"
             :placeholder="randomNamePlaceholder" 
             class="bg-transparent text-[10px] font-bold text-slate-400 dark:text-slate-500 outline-none mb-0.5 w-full bg-transparent border-none p-0 focus:ring-0"
             title="点击修改昵称"
           >
           
           <textarea 
             v-model="newComment.content"
             @focus="isInputFocused = true"
             @blur="checkBlur"
             @keydown.enter.prevent="handleEnter"
             ref="textareaRef"
             rows="1"
             placeholder="写点什么..."
             class="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none resize-none placeholder-slate-400 leading-relaxed max-h-32 p-0 border-none focus:ring-0"
           ></textarea>
        </div>
        
        <!-- 发送按钮 -->
        <button 
          @click="handleSubmit"
          :disabled="submitting || !newComment.content.trim()"
          class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group mb-0.5 mr-0.5"
          :class="newComment.content.trim() ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-300 cursor-not-allowed'"
        >
           <i v-if="submitting" class="ph ph-spinner animate-spin text-lg"></i>
           <i v-else class="ph ph-paper-plane-tilt-fill text-lg translate-x-0.5 translate-y-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { commentApi } from '@/api/comments'
import { useAuthStore } from '@/stores/auth'
import type { Comment } from '@/types/comment'

const authStore = useAuthStore()
const STORAGE_AUTHOR_KEY = 'mindspace_comment_author'

const props = defineProps<{
  postId: string
}>()

const comments = ref<Comment[]>([])
const loading = ref(true)
const submitting = ref(false)
const deletingId = ref<string | null>(null)
const isInputFocused = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const currentSort = ref<'time' | 'likes'>('time')

// 随机昵称库
const adjectives = ['迷路的', '安静的', '发光的', '思考的', '赛博', '漂流的', '神秘的', '快乐的', '深沉的', '浪漫的']
const nouns = ['宇航员', '观察者', '旅行家', '流浪猫', '电子羊', '诗人', '梦想家', '信使', '过客', '艺术家']

const generateRandomName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}${noun}`
}

const randomNamePlaceholder = ref(generateRandomName())

const newComment = ref({
  author: '',
  content: ''
})

const replyingTo = ref<Comment | null>(null)

const handleRandomName = () => {
  newComment.value.author = generateRandomName()
}

// 键盘事件
const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return // Shift+Enter 允许换行
  handleSubmit()
}

const formatDate = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60000) return '刚刚'
  // 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  // 小于24小时
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

const loadComments = async () => {
  try {
    loading.value = true
    const res = await commentApi.getComments(props.postId, currentSort.value)
    if (res.code === 200 && res.data) {
      comments.value = res.data
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
  } finally {
    loading.value = false
  }
}

const changeSort = (sort: 'time' | 'likes') => {
  if (currentSort.value === sort) return
  currentSort.value = sort
  loadComments()
}

const handleReply = (comment: Comment) => {
  replyingTo.value = comment
  isInputFocused.value = true
  // 滚动到底部并聚焦
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const cancelReply = () => {
  replyingTo.value = null
}

const handleLike = async (comment: Comment) => {
  // 乐观更新
  const originalState = { ...comment }
  comment.isLiked = !comment.isLiked
  comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1
  
  try {
    const res = await commentApi.likeComment(comment.id)
    if (res.code === 200 && res.data) {
      // 使用服务器返回的最新数据校准
      comment.isLiked = res.data.isLiked
      comment.likes = res.data.likes
    } else {
      // 失败回滚
      Object.assign(comment, originalState)
    }
  } catch (e) {
    Object.assign(comment, originalState)
  }
}

const handleDelete = async (comment: Comment) => {
  if (!confirm('确定要删除这条评论吗？')) return
  
  deletingId.value = comment.id
  try {
    const res = await commentApi.deleteComment(comment.id)
    if (res.code === 200) {
      // 从列表中移除
      comments.value = comments.value.filter(c => c.id !== comment.id)
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    alert('删除失败，请重试')
  } finally {
    deletingId.value = null
  }
}

const checkBlur = () => {
  // 延迟失焦，防止点击发送按钮时已经触发失焦导致UI收起
  setTimeout(() => {
    isInputFocused.value = false
  }, 200)
}

const handleSubmit = async () => {
  if (!newComment.value.content.trim()) return

  try {
    submitting.value = true
    
    // 如果没有填写昵称，使用生成的随机昵称
    const finalAuthor = newComment.value.author || randomNamePlaceholder.value
    
    const res = await commentApi.createComment({
      postId: props.postId,
      content: newComment.value.content,
      author: finalAuthor,
      replyToId: replyingTo.value?.id
    })
    
    if (res.code === 201 && res.data) {
      // 缓存昵称
      localStorage.setItem(STORAGE_AUTHOR_KEY, finalAuthor)

      const created = res.data
      
      // 插入列表 (如果是在最新排序下)
      if (currentSort.value === 'time') {
        comments.value.unshift(created)
      } else {
        // 重新加载以确保排序正确
        loadComments()
      }
      
      // 重置
      newComment.value.content = ''
      replyingTo.value = null
      
      // 如果是用随机昵称发送的，将随机昵称填入输入框，因为已经缓存了
      if (!newComment.value.author) {
        newComment.value.author = finalAuthor
      }
    }
  } catch (error) {
    console.error('Failed to post comment:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 读取缓存昵称
  const cachedName = localStorage.getItem(STORAGE_AUTHOR_KEY)
  if (cachedName) {
    newComment.value.author = cachedName
  }
  loadComments()
})
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