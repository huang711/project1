<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <nav class="sidebar">
      <div class="logo">🎥 AI短剧平台</div>
      <RouterLink to="/" class="nav-item">📊 工作台</RouterLink>
      <RouterLink to="/editor" class="nav-item">✨ 创作编辑器</RouterLink>
      <RouterLink to="/assets" class="nav-item">🗂️ 资产库</RouterLink>
      <RouterLink to="/tasks" class="nav-item">🚀 任务中心</RouterLink>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.sidebar {
  width: 240px;
  background-color: #1e1e2d;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #42b883;
}

.nav-item {
  color: #a2a3b7;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: #2b2b40;
  color: white;
}

.main-content {
  flex: 1;
  background-color: #f5f6fa;
  overflow-y: auto;
  padding: 20px;
}
</style>