<script setup>
const tasks = [
  { id: 'T-1001', name: '场景1-镜头3 生成', status: 'Running', progress: 45 },
  { id: 'T-1002', name: '角色模型训练', status: 'Completed', progress: 100 },
  { id: 'T-1003', name: '全片渲染导出', status: 'Pending', progress: 0 }
]
</script>

<template>
  <div class="tasks-page">
    <h2>🚀 任务处理中心</h2>
    <table class="task-table">
      <thead>
        <tr>
          <th>任务 ID</th>
          <th>任务名称</th>
          <th>状态</th>
          <th>进度</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>
            <span class="badge" :class="task.status.toLowerCase()">{{ task.status }}</span>
          </td>
          <td>
            <div class="progress-bar">
              <div class="fill" :style="{ width: task.progress + '%' }"></div>
            </div>
          </td>
          <td><button>详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.task-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin-top: 20px; }
.task-table th, .task-table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.badge.running { background: #e0f2fe; color: #0284c7; }
.badge.completed { background: #dcfce7; color: #16a34a; }
.badge.pending { background: #f3f4f6; color: #6b7280; }
.progress-bar { width: 100px; height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.fill { height: 100%; background: #42b883; }
</style>