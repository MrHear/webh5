<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-slate-800 dark:text-slate-200 font-sans transition-colors duration-500">
    <!-- 顶部栏 -->
    <div class="h-16 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between px-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="hover:text-indigo-500 transition-colors">
          <i class="ph ph-arrow-left text-xl"></i>
        </button>
        <span class="text-xs text-slate-400 tracking-wider">写作模式</span>
      </div>

      <div class="flex items-center gap-6">
        <!-- 模式切换器 -->
        <div class="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-gray-200/50 dark:border-white/5">
          <button 
            @click="currentMode = 'markdown'"
            class="px-4 py-1.5 text-xs rounded-md transition-all font-medium"
            :class="currentMode === 'markdown' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            Markdown
          </button>
          <button 
            @click="currentMode = 'richtext'"
            class="px-4 py-1.5 text-xs rounded-md transition-all font-medium"
            :class="currentMode === 'richtext' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            富文本
          </button>
        </div>

        <button 
          @click="handlePublish"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          <i class="ph ph-paper-plane-right"></i>
          发布
        </button>
      </div>
    </div>

    <!-- 核心区域 -->
    <div class="flex-1 flex flex-col max-w-5xl mx-auto w-full p-8 gap-8">
      <!-- 标题输入 -->
      <input 
        v-model="title"
        type="text" 
        placeholder="输入文章标题..." 
        class="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none border-none py-4"
      />

      <!-- 编辑器 -->
      <div class="flex-1 min-h-[500px] border border-gray-200/50 dark:border-white/5 rounded-2xl overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm">
        <!-- Markdown 编辑器 -->
        <MdEditor 
          v-if="currentMode === 'markdown'"
          v-model="content" 
          :theme="isDarkMode ? 'dark' : 'light'" 
          language="zh-CN"
          class="h-full !bg-transparent"
        />
        
        <!-- 富文本编辑器 -->
        <div v-else class="h-full flex flex-col">
          <div v-if="editor" class="border-b border-gray-200/50 dark:border-white/5 p-2 flex gap-2 bg-gray-50/50 dark:bg-white/5">
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('bold') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400">
              <i class="ph ph-text-b"></i>
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('italic') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400">
              <i class="ph ph-text-italic"></i>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400">
              <i class="ph ph-text-h-two"></i>
            </button>
          </div>
          <editor-content :editor="editor" class="flex-1 p-6 prose dark:prose-invert prose-indigo max-w-none overflow-y-auto focus:outline-none" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const router = useRouter()
const postsStore = usePostsStore()

const currentMode = ref<'markdown' | 'richtext'>('markdown')
const title = ref('')
const content = ref('')
const isDarkMode = ref(false)

// 检测当前主题
onMounted(() => {
  const checkTheme = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  checkTheme()
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

// Tiptap setup
const editor = useEditor({
  content: '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[300px]',
    },
  },
  onUpdate: ({ editor }) => {
    if (currentMode.value === 'richtext') {
      content.value = editor.getHTML()
    }
  }
})

watch(currentMode, (newMode) => {
  if (newMode === 'richtext') {
    if (editor.value && !editor.value.getText()) {
      editor.value.commands.setContent(content.value)
    }
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const handlePublish = () => {
  if (!title.value.trim()) {
    alert('错误: 标题不能为空')
    return
  }
  
  let finalContent = content.value
  if (currentMode.value === 'richtext' && editor.value) {
    finalContent = editor.value.getHTML()
  }

  postsStore.addPost({
    title: title.value,
    content: finalContent,
    summary: finalContent.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...', 
    type: currentMode.value,
    tags: ['随笔']
  })

  router.push('/')
}
</script>

<style>
/* 覆盖 md-editor 样式以适应透明背景 */
.md-editor {
  background-color: transparent !important;
}
.md-editor-dark {
  --md-bk-color: transparent !important;
}
</style>
