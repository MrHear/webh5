import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Post {
  id: string
  title: string
  summary: string
  content: string
  type: 'markdown' | 'richtext'
  tags: string[]
  createdAt: string
  views: number
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([
    {
      id: '1',
      title: '神经网络与赛博植入体技术解析',
      summary: '探索2077年生物神经元与硅基芯片之间的接口技术发展。',
      content: '# 神经网络与赛博植入体技术解析\n\n**人类**与**机器**的界限日益模糊。\n\n## 接口技术\n\n最近在*神经编织*方面的突破允许直接的突触反馈...',
      type: 'markdown',
      tags: ['技术', '赛博义体'],
      createdAt: '2077-09-12',
      views: 1240
    },
    {
      id: '2',
      title: '第七区的霓虹雨夜',
      summary: '关于雨水冲刷过的街道和虚空寂静的个人反思。',
      content: '<p><strong>第七区</strong>的雨从未停过。它冲刷掉了尘垢，却冲不走记忆。</p><p>我坐在拉面摊前，看着肉汤中倒映的霓虹灯...</p>',
      type: 'richtext',
      tags: ['生活', '黑色电影'],
      createdAt: '2077-09-14',
      views: 890
    }
  ])

  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'views'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
      views: 0
    }
    posts.value.unshift(newPost)
  }

  const getPostById = (id: string) => {
    return posts.value.find(p => p.id === id)
  }

  return {
    posts,
    addPost,
    getPostById
  }
})
