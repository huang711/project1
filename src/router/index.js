import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CreativeEditor from '../views/CreativeEditor.vue'
import AssetLibrary from '../views/AssetLibrary.vue'
import TaskCenter from '../views/TaskCenter.vue'
import StoryboardProduction from '../views/StoryboardProduction.vue' // 新增

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/editor',
      name: 'editor',
      component: CreativeEditor
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetLibrary
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskCenter
    },
    // 新增路由
    {
      path: '/storyboard',
      name: 'storyboard',
      component: StoryboardProduction
    }
  ]
})

export default router