/**
 * 认证状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth'
import type { LoginRequest } from '@/types/api'

const TOKEN_KEY = 'token'
const TOKEN_EXPIRES_KEY = 'token_expires'

export const useAuthStore = defineStore('auth', () => {
  // Token
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const tokenExpires = ref<number | null>(
    localStorage.getItem(TOKEN_EXPIRES_KEY)
      ? parseInt(localStorage.getItem(TOKEN_EXPIRES_KEY)!)
      : null
  )

  // 是否已登录
  const isLoggedIn = computed(() => {
    if (!token.value || !tokenExpires.value) return false
    // 检查是否过期
    return Date.now() < tokenExpires.value
  })

  // 登录中状态
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 登录
   */
  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null

    try {
      const res = await loginApi(credentials)

      if (res.code === 200 && res.data) {
        const { access_token, expires_in } = res.data
        const expiresAt = Date.now() + expires_in * 1000

        // 保存到状态和本地存储
        token.value = access_token
        tokenExpires.value = expiresAt
        localStorage.setItem(TOKEN_KEY, access_token)
        localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString())

        return true
      } else {
        error.value = res.message || '登录失败'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.message || '登录失败'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    token.value = null
    tokenExpires.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_KEY)
  }

  /**
   * 清除错误
   */
  function clearError() {
    error.value = null
  }

  return {
    token,
    isLoggedIn,
    loading,
    error,
    login,
    logout,
    clearError
  }
})
