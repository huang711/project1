<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    
    <nav class="global-sidebar">
      <div class="brand">
        <div class="logo-icon">AI</div>
        <div class="logo-text">Studio <span class="version">PRO</span></div>
      </div>
      
      <div class="nav-links">
        <RouterLink to="/editor" class="nav-item" title="剧本创作">

          <span class="text">剧本创作</span>
        </RouterLink>

        <RouterLink to="/storyboard" class="nav-item" title="分镜制作">

          <span class="text">分镜制作</span>
        </RouterLink>

        <RouterLink to="/assets" class="nav-item" title="资产中心">

          <span class="text">资产中心</span>
        </RouterLink>

        <RouterLink to="/tasks" class="nav-item" title="任务中心">

          <span class="text">任务中心</span>
        </RouterLink>

        <a class="nav-item disabled">

          <span class="text">看板</span>
        </a>
      </div>

      <div class="nav-footer">
        <a class="nav-item"><span class="icon">⚙️</span> <span class="text">系统设置</span></a>
      </div>
    </nav>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 全局重置 (Dark Mode Base) */
html, body { margin: 0; padding: 0; height: 100%; font-family: 'Segoe UI', 'PingFang SC', sans-serif; background: #0f0f0f; color: #E0E0E0; }
#app { height: 100vh; display: flex; flex-direction: column; }

.app-layout { display: flex; height: 100%; width: 100%; overflow: hidden; }

/* --- 侧边栏样式 --- */
.global-sidebar {
  width: 240px;
  background-color: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 100;
}

.brand { height: 60px; display: flex; align-items: center; padding: 0 20px; gap: 10px; border-bottom: 1px solid #2a2a2a; }
.logo-icon { width: 24px; height: 24px; background: #409EFF; border-radius: 4px; color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.logo-text { font-size: 16px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 6px; }
.version { font-size: 10px; background: #333; padding: 2px 4px; border-radius: 4px; color: #888; }

.nav-links { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 5px; }
.nav-item {
  display: flex; align-items: center; padding: 10px 15px;
  color: #888; text-decoration: none; transition: 0.2s; cursor: pointer; border-radius: 8px; font-size: 14px;
}
.nav-item:hover { background-color: #252525; color: #eee; }
.nav-item.router-link-active { background-color: #2a2d3e; color: #409EFF; font-weight: 600; }
.nav-item .icon { margin-right: 12px; font-size: 16px; width: 20px; text-align: center; }
.nav-item.disabled { opacity: 0.4; cursor: not-allowed; }

.nav-footer { padding: 10px; border-top: 1px solid #2a2a2a; }

/* 内容区 */
.app-content { flex: 1; position: relative; overflow: hidden; background: #0f0f0f; }
</style>