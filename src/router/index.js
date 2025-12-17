import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CreativeEditor from '../views/CreativeEditor.vue'
import AssetLibrary from '../views/AssetLibrary.vue'
import TaskCenter from '../views/TaskCenter.vue'

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
    }
  ]
})

export default router