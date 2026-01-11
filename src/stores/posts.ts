/**
 * 文章状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getPosts as getPostsApi,
  getPostById as getPostByIdApi,
  createPost as createPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  type GetPostsParams
} from '@/api/posts'
import type { PostInList, PostDetail, PostCreateRequest, PostUpdateRequest, PostType } from '@/types/api'

export interface Post {
  id: string
  title: string
  summary: string
  content: string
  type: PostType
  tags: string[]
  createdAt: string
  views: number
}

export const usePostsStore = defineStore('posts', () => {
  // 文章列表
  const posts = ref<PostInList[]>([])
  // 当前查看的文章详情
  const currentPost = ref<PostDetail | null>(null)
  // 分页信息
  const total = ref(0)
  const page = ref(1)
  // 加载状态
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取文章列表
   */
  async function fetchPosts(params: GetPostsParams = {}) {
    loading.value = true
    error.value = null

    try {
      const res = await getPostsApi(params)

      if (res.code === 200 && res.data) {
        posts.value = res.data.list
        total.value = res.data.total
        page.value = res.data.page
      } else {
        error.value = res.message || '获取文章列表失败'
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || '获取文章列表失败'
      console.error('获取文章列表失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取文章详情
   */
  async function fetchPostById(id: string): Promise<PostDetail | null> {
    loading.value = true
    error.value = null

    try {
      const res = await getPostByIdApi(id)

      if (res.code === 200 && res.data) {
        currentPost.value = res.data
        return res.data
      } else {
        error.value = res.message || '获取文章详情失败'
        return null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.message || '获取文章详情失败'
      console.error('获取文章详情失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建文章
   */
  async function addPost(data: PostCreateRequest): Promise<string | null> {
    loading.value = true
    error.value = null

    try {
      const res = await createPostApi(data)

      if (res.code === 201 && res.data) {
        // 刷新列表
        await fetchPosts()
        return res.data.id
      } else {
        error.value = res.message || '创建文章失败'
        return null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.message || '创建文章失败'
      console.error('创建文章失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新文章
   */
  async function editPost(id: string, data: PostUpdateRequest): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const res = await updatePostApi(id, data)

      if (res.code === 200) {
        // 刷新列表
        await fetchPosts()
        return true
      } else {
        error.value = res.message || '更新文章失败'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.message || '更新文章失败'
      console.error('更新文章失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除文章
   */
  async function removePost(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const res = await deletePostApi(id)

      if (res.code === 200) {
        // 从列表中移除
        posts.value = posts.value.filter(p => p.id !== id)
        return true
      } else {
        error.value = res.message || '删除文章失败'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.message || '删除文章失败'
      console.error('删除文章失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据 ID 从本地列表获取文章（用于快速访问）
   */
  function getPostById(id: string): PostInList | undefined {
    return posts.value.find(p => p.id === id)
  }

  /**
   * 清除错误
   */
  function clearError() {
    error.value = null
  }

  return {
    // 状态
    posts,
    currentPost,
    total,
    page,
    loading,
    error,
    // 方法
    fetchPosts,
    fetchPostById,
    addPost,
    editPost,
    removePost,
    getPostById,
    clearError
  }
})
