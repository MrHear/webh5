<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-slate-800 dark:text-slate-200 font-sans transition-colors duration-500">
    <!-- 顶部栏 -->
    <div class="h-16 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between px-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="hover:text-indigo-500 transition-colors">
          <i class="ph ph-arrow-left text-xl"></i>
        </button>
        <span class="text-xs text-slate-400 tracking-wider">{{ isEditing ? '编辑文章' : '写作模式' }}</span>
      </div>

      <div class="flex items-center gap-6">
        <!-- 登录状态 -->
        <div v-if="!authStore.isLoggedIn" class="flex items-center gap-2">
          <button 
            @click="showLoginModal = true"
            class="text-sm text-slate-500 hover:text-indigo-500 transition-colors"
          >
            <i class="ph ph-sign-in mr-1"></i> 登录后发布
          </button>
        </div>
        <div v-else class="flex items-center gap-2">
          <span class="text-xs text-green-500"><i class="ph ph-check-circle"></i> 已登录</span>
          <button 
            @click="authStore.logout()"
            class="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            退出
          </button>
        </div>

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
          :disabled="publishing"
          class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          <i v-if="publishing" class="ph ph-circle-notch animate-spin"></i>
          <i v-else class="ph ph-paper-plane-right"></i>
          {{ publishing ? '发布中...' : (isEditing ? '更新' : '发布') }}
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

      <!-- 标签输入 -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs text-slate-400">标签：</span>
        <div 
          v-for="(tag, index) in tags" 
          :key="index"
          class="flex items-center gap-1 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-sm"
        >
          <span>{{ tag }}</span>
          <button @click="removeTag(index)" class="text-slate-400 hover:text-red-500">
            <i class="ph ph-x text-xs"></i>
          </button>
        </div>
        <input 
          v-model="newTag"
          @keydown.enter.prevent="addTag"
          type="text" 
          placeholder="添加标签..."
          class="bg-transparent text-sm outline-none border-none placeholder-slate-400 w-24"
        />
      </div>

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
          <div v-if="editor" class="border-b border-gray-200/50 dark:border-white/5 p-2 flex flex-wrap gap-1 bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-sm">
            <!-- 基础格式 -->
            <div class="flex items-center gap-1 border-r border-gray-300/30 pr-2 mr-1">
              <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('bold') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="加粗">
                <i class="ph ph-text-b"></i>
              </button>
              <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('italic') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="斜体">
                <i class="ph ph-text-italic"></i>
              </button>
              <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('strike') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="删除线">
                <i class="ph ph-text-strikethrough"></i>
              </button>
              <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('code') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="行内代码">
                <i class="ph ph-code"></i>
              </button>
            </div>
            
            <!-- 标题 -->
            <div class="flex items-center gap-1 border-r border-gray-300/30 pr-2 mr-1">
              <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="一级标题">
                <i class="ph ph-text-h-one"></i>
              </button>
              <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="二级标题">
                <i class="ph ph-text-h-two"></i>
              </button>
              <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('heading', { level: 3 }) }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="三级标题">
                <i class="ph ph-text-h-three"></i>
              </button>
            </div>

            <!-- 列表与引用 -->
            <div class="flex items-center gap-1 border-r border-gray-300/30 pr-2 mr-1">
              <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('bulletList') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="无序列表">
                <i class="ph ph-list-bullets"></i>
              </button>
              <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('orderedList') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="有序列表">
                <i class="ph ph-list-numbers"></i>
              </button>
              <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('blockquote') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="引用">
                <i class="ph ph-quotes"></i>
              </button>
              <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': editor.isActive('codeBlock') }" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="代码块">
                <i class="ph ph-code-block"></i>
              </button>
            </div>

            <!-- 其他 -->
            <div class="flex items-center gap-1">
              <button @click="editor.chain().focus().setHorizontalRule().run()" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400" title="分割线">
                <i class="ph ph-minus"></i>
              </button>
              <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 disabled:opacity-50" title="撤销">
                <i class="ph ph-arrow-u-up-left"></i>
              </button>
              <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 disabled:opacity-50" title="重做">
                <i class="ph ph-arrow-u-up-right"></i>
              </button>
            </div>
          </div>
          <editor-content :editor="editor" class="flex-1 p-6 prose dark:prose-invert prose-indigo max-w-none overflow-y-auto focus:outline-none min-h-[400px]" />
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" />

    <!-- 错误提示 -->
    <div 
      v-if="errorMessage"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
    >
      <i class="ph ph-warning-circle"></i>
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="ml-2 hover:text-red-200">
        <i class="ph ph-x"></i>
      </button>
    </div>

    <!-- 成功提示 -->
    <div 
      v-if="successMessage"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
    >
      <i class="ph ph-check-circle"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import LoginModal from '@/components/common/LoginModal.vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { PostType } from '@/types/api'

const router = useRouter()
const route = useRoute()
const postsStore = usePostsStore()
const authStore = useAuthStore()

const currentMode = ref<PostType>('markdown')
const title = ref('')
const content = ref('')
const tags = ref<string[]>([])
const newTag = ref('')
const isDarkMode = ref(false)
const publishing = ref(false)
const showLoginModal = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isEditing = ref(false)
const editId = ref('')

// 检测当前主题和编辑模式
onMounted(async () => {
  const checkTheme = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  checkTheme()
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  // 检查是否为编辑模式
  const id = route.query.id as string
  if (id) {
    isEditing.value = true
    editId.value = id
    const post = await postsStore.fetchPostById(id)
    if (post) {
      title.value = post.title
      content.value = post.content
      tags.value = [...post.tags]
      currentMode.value = post.type
      
      if (post.type === 'richtext' && editor.value) {
        editor.value.commands.setContent(post.content)
      }
    } else {
      errorMessage.value = '加载文章失败'
    }
  }
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
    if (editor.value && !editor.value.getText() && content.value) {
      editor.value.commands.setContent(content.value)
    }
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// 标签管理
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag) && tags.value.length < 10) {
    tags.value.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

// 发布处理
const handlePublish = async () => {
  // 验证标题
  if (!title.value.trim()) {
    errorMessage.value = '标题不能为空'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  // 检查登录状态
  if (!authStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  // 获取内容
  let finalContent = content.value
  if (currentMode.value === 'richtext' && editor.value) {
    finalContent = editor.value.getHTML()
  }

  if (!finalContent.trim()) {
    errorMessage.value = '内容不能为空'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  // 生成摘要
  let summaryText = finalContent
  
  if (currentMode.value === 'markdown') {
    // 移除 Markdown 图片/链接 [text](url) -> text
    summaryText = summaryText.replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    summaryText = summaryText.replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // 移除标题 # Title -> Title
    summaryText = summaryText.replace(/#+\s/g, '')
    // 移除代码块 ```code``` -> code
    summaryText = summaryText.replace(/```[\s\S]*?```/g, '')
    // 移除行内代码 `code` -> code
    summaryText = summaryText.replace(/`([^`]+)`/g, '$1')
    // 移除表格线 | - :
    summaryText = summaryText.replace(/[|:\-]/g, ' ')
    // 移除其他常见符号
    summaryText = summaryText.replace(/[*_~>]/g, '')
  }
  
  // 移除 HTML 标签 (适用于 Markdown 混排或富文本)
  summaryText = summaryText.replace(/<[^>]*>?/gm, '')
  // 压缩空白
  summaryText = summaryText.replace(/\s+/g, ' ').trim()

  const summary = summaryText.substring(0, 200) + (summaryText.length > 200 ? '...' : '')

  publishing.value = true

  const postData = {
    title: title.value,
    content: finalContent,
    summary: summary,
    type: currentMode.value,
    tags: tags.value
  }

  let resultId: string | boolean | null

  if (isEditing.value) {
    resultId = await postsStore.editPost(editId.value, postData)
  } else {
    resultId = await postsStore.addPost(postData)
  }

  publishing.value = false

  if (resultId) {
    successMessage.value = isEditing.value ? '更新成功！' : '发布成功！'
    setTimeout(() => {
      // 如果是更新，返回到文章详情；如果是新建，返回到新文章详情
      const targetId = isEditing.value ? editId.value : resultId
      router.push(`/post/${targetId}`)
    }, 1000)
  } else {
    errorMessage.value = postsStore.error || (isEditing.value ? '更新失败' : '发布失败')
    setTimeout(() => errorMessage.value = '', 3000)
  }
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
