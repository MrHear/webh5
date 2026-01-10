import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import EditorView from '@/views/EditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'post/:id',
          name: 'post-detail',
          component: ArticleDetail
        }
      ]
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView
    }
  ]
})

export default router
