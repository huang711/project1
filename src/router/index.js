import { createRouter, createWebHistory } from 'vue-router'
import CreativeEditor from '../views/CreativeEditor.vue'
import StoryboardProduction from '../views/StoryboardProduction.vue'
import AssetLibrary from '../views/AssetLibrary.vue'
import TaskCenter from '../views/TaskCenter.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/editor'
    },
    {
      path: '/editor',
      name: 'editor',
      component: CreativeEditor
    },
    {
      path: '/storyboard',
      name: 'storyboard',
      component: StoryboardProduction
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