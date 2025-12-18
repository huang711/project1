<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 1. 引入路由钩子

const router = useRouter() // 2. 获取路由实例

// 顶部核心数据
const stats = ref([
  { title: '作品总数', value: 12, unit: '部', icon: '📄', color: '#6366f1' },
  { title: '累计生成', value: 3400, unit: '镜', icon: '🎬', color: '#8b5cf6' },
  { title: '本月算力', value: '120/500', unit: '小时', icon: '⚡', color: '#f59e0b' },
  { title: '云端存储', value: '45.2', unit: 'GB', icon: '☁️', color: '#10b981' }
])

// 项目进度看板
const projects = ref([
  {
    id: 1,
    name: '科幻短片：星际迷航',
    totalShots: 150,
    status: { pending: 20, processing: 40, auditing: 30, done: 60 },
    updateTime: '5分钟前'
  },
  {
    id: 2,
    name: '悬疑剧：消失的硬币',
    totalShots: 80,
    status: { pending: 5, processing: 5, auditing: 10, done: 60 },
    updateTime: '半小时前'
  },
  {
    id: 3,
    name: '吴楷的个人Vlog',
    totalShots: 45,
    status: { pending: 40, processing: 5, auditing: 0, done: 0 },
    updateTime: '昨天'
  }
])

const getPercent = (val, total) => (val / total) * 100 + '%'

// 待办与消息
const todoList = ref([
  { id: 101, tag: '待审核', content: '星际迷航：第3场 - 镜头08 (光影需调整)', time: '15分钟前', urgent: false },
  { id: 102, tag: '渲染失败', content: '消失的硬币：场景2 (服务器超时)', time: '1小时前', urgent: true },
  { id: 103, tag: '系统通知', content: '新模型 SDXL-Turbo 已上线', time: '2小时前', urgent: false }
])

// 3. 定义新建跳转函数
const handleCreate = () => {
  // 根据文档描述，新建作品的第一步是进入“创作编辑器”进行剧本处理
  router.push('/editor')
}
</script>

<template>
  <div class="dashboard-container">
    <header class="header-section">
      <div class="welcome-text">
        <h2>欢迎回来，吴楷 👋</h2>
        <p>今天是充满创意的一天，系统运行正常。</p>
      </div>
      <button class="create-btn" @click="handleCreate">+ 新建作品</button>
    </header>

    <section class="stats-grid">
      <div v-for="item in stats" :key="item.title" class="stat-card">
        <div class="stat-icon" :style="{ background: item.color + '20', color: item.color }">
          {{ item.icon }}
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ item.value }} <small>{{ item.unit }}</small></div>
          <div class="stat-title">{{ item.title }}</div>
        </div>
      </div>
    </section>

    <div class="main-layout">
      <section class="progress-panel">
        <div class="panel-header">
          <h3>📽️ 作品生产进度</h3>
          <span class="subtitle">全链路状态监控</span>
        </div>
        
        <div class="project-list">
          <div v-for="project in projects" :key="project.id" class="project-item">
            <div class="project-info">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-meta">共 {{ project.totalShots }} 镜 · {{ project.updateTime }}更新</span>
            </div>
            
            <div class="progress-track">
              <div class="bar done" :style="{ width: getPercent(project.status.done, project.totalShots) }"></div>
              <div class="bar auditing" :style="{ width: getPercent(project.status.auditing, project.totalShots) }"></div>
              <div class="bar processing" :style="{ width: getPercent(project.status.processing, project.totalShots) }"></div>
            </div>

            <div class="progress-legend">
              <span class="legend-item done"><i>●</i> 完成 {{ project.status.done }}</span>
              <span class="legend-item auditing"><i>●</i> 待审 {{ project.status.auditing }}</span>
              <span class="legend-item processing"><i>●</i> 生成中 {{ project.status.processing }}</span>
              <span class="legend-item pending"><i>●</i> 待领 {{ project.status.pending }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="todo-panel">
        <div class="panel-header">
          <h3>🔔 待办事项</h3>
        </div>
        <div class="todo-list">
          <div v-for="item in todoList" :key="item.id" class="todo-item">
            <div class="todo-tag" :class="{ urgent: item.urgent }">{{ item.tag }}</div>
            <div class="todo-content">
              <p>{{ item.content }}</p>
              <small>{{ item.time }}</small>
            </div>
            <button class="btn-action">处理</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 保持原有样式不变 */
.dashboard-container { padding: 10px; max-width: 1400px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.welcome-text h2 { margin: 0; font-size: 24px; color: #1f2937; }
.welcome-text p { margin: 5px 0 0; color: #6b7280; }
.create-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.create-btn:hover { background: #1d4ed8; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.stat-value { font-size: 22px; font-weight: bold; color: #111; }
.stat-value small { font-size: 13px; color: #888; font-weight: normal; margin-left: 4px; }
.stat-title { color: #666; font-size: 13px; }
.main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.progress-panel, .todo-panel { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
.panel-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.panel-header h3 { margin: 0; font-size: 18px; color: #111; }
.subtitle { font-size: 12px; color: #9ca3af; }
.project-item { margin-bottom: 25px; }
.project-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
.project-name { font-weight: 600; color: #374151; }
.project-meta { color: #9ca3af; font-size: 12px; }
.progress-track { height: 10px; background: #f3f4f6; border-radius: 5px; overflow: hidden; display: flex; margin-bottom: 8px; }
.bar { height: 100%; transition: width 0.5s ease; }
.bar.done { background: #10b981; }
.bar.auditing { background: #f59e0b; }
.bar.processing { background: #3b82f6; }
.progress-legend { display: flex; gap: 12px; font-size: 11px; color: #6b7280; }
.legend-item { display: flex; align-items: center; gap: 3px; }
.legend-item i { font-style: normal; font-size: 12px; line-height: 1; }
.legend-item.done i { color: #10b981; }
.legend-item.auditing i { color: #f59e0b; }
.legend-item.processing i { color: #3b82f6; }
.legend-item.pending i { color: #e5e7eb; }
.todo-item { display: flex; align-items: flex-start; gap: 10px; padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px dashed #f3f4f6; }
.todo-tag { font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #eef2ff; color: #4f46e5; white-space: nowrap; margin-top: 2px; }
.todo-tag.urgent { background: #fef2f2; color: #ef4444; }
.todo-content p { margin: 0 0 2px; font-size: 13px; color: #374151; }
.todo-content small { color: #9ca3af; font-size: 11px; }
.btn-action { margin-left: auto; font-size: 11px; color: #2563eb; background: #eff6ff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
.btn-action:hover { background: #dbeafe; }
</style>