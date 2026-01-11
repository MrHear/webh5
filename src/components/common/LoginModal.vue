<template>
  <div 
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-6">管理员登录</h3>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="text-sm text-slate-500 mb-1 block">用户名</label>
          <input 
            v-model="loginForm.username"
            type="text"
            class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="输入用户名"
          />
        </div>
        <div>
          <label class="text-sm text-slate-500 mb-1 block">密码</label>
          <input 
            v-model="loginForm.password"
            type="password"
            class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="输入密码"
          />
        </div>

        <div v-if="authStore.error" class="text-red-500 text-sm">
          {{ authStore.error }}
        </div>

        <div class="flex gap-3 pt-4">
          <button 
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            :disabled="authStore.loading"
            class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
          >
            {{ authStore.loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'login-success'): void
}>()

const authStore = useAuthStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const closeModal = () => {
  emit('update:modelValue', false)
  authStore.clearError()
}

const handleLogin = async () => {
  authStore.clearError()
  const success = await authStore.login(loginForm)
  if (success) {
    emit('update:modelValue', false)
    emit('login-success')
    loginForm.username = ''
    loginForm.password = ''
  }
}
</script>
