<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const stats = reactive({
  total: 4,
  running: 1,
  success: 2,
  failed: 1,
  avgTime: '45秒'
})

const currentFilter = ref('all')

const rawTaskList = ref([
  { 
    id: 'T-20250315-01', shotName: '镜头01: 霓虹倒影', type: '视频生成', model: 'Sora-Turbo', 
    status: 'success', progress: 100, startTime: '10:30:00', duration: '42秒' 
  },
  { 
    id: 'T-20250315-02', shotName: '镜头02: 铁门开启', type: '视频生成', model: 'Runway Gen-3', 
    status: 'running', progress: 68, startTime: '10:35:10', duration: '计算中...' 
  },
  { 
    id: 'T-20250315-03', shotName: '镜头03: 掮客特写', type: '提示词优化', model: 'GPT-4', 
    status: 'failed', progress: 40, startTime: '10:32:00', duration: '12秒' 
  },
  { 
    id: 'T-20250315-04', shotName: '镜头04: 雨夜全景', type: '视频生成', model: 'Pika Art', 
    status: 'success', progress: 100, startTime: '10:20:00', duration: '35秒' 
  }
])

const taskDetails = ref([])
const activeTask = ref(null)
const showDrawer = ref(false)

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    rawTaskList.value.forEach(task => {
      if (task.status === 'running') {
        if (task.progress < 98) task.progress += 0.5
      }
    })
  }, 500)
})
onUnmounted(() => clearInterval(timer))

const filteredList = computed(() => {
  if (currentFilter.value === 'all') return rawTaskList.value
  return rawTaskList.value.filter(t => t.status === currentFilter.value)
})

const setFilter = (status) => {
  currentFilter.value = status
}

const openDetails = (task) => {
  activeTask.value = task
  showDrawer.value = true
  if (task.status === 'success') {
    taskDetails.value = [
      { time: '10:30:00', type: 'info', msg: '任务已提交到队列' },
      { time: '10:30:02', type: 'info', msg: 'GPU 资源分配成功 (节点 A-101)' },
      { time: '10:30:05', type: 'info', msg: `加载模型 [${task.model}] 完成` },
      { time: '10:30:42', type: 'success', msg: '视频生成完毕，已上传至云存储' }
    ]
  } else if (task.status === 'failed') {
    taskDetails.value = [
      { time: '10:32:00', type: 'info', msg: '任务已提交' },
      { time: '10:32:05', type: 'warn', msg: '网络连接波动，正在重试...' },
      { time: '10:32:12', type: 'error', msg: '错误：API 响应超时 (Error 504)' },
      { time: '10:32:12', type: 'error', msg: '任务因异常终止' }
    ]
  } else {
    taskDetails.value = [
      { time: '10:35:10', type: 'info', msg: '任务开始执行' },
      { time: '10:35:15', type: 'info', msg: '正在进行画面降噪处理...' },
      { time: '10:35:20', type: 'info', msg: '当前生成进度正常' }
    ]
  }
}

const getStatusColor = (status) => {
  const map = { pending: 'gray', running: 'blue', success: 'green', failed: 'red' }
  return map[status] || 'gray'
}
const getStatusText = (status) => {
  const map = { pending: '等待中', running: '执行中', success: '已完成', failed: '失败' }
  return map[status]
}
</script>

<template>
  <div class="task-center-container">
    <header class="dashboard-header">
      <div class="title-block">
        <h2>任务中心</h2>
        <span class="subtitle">Task Center</span>
      </div>
      <div class="stats-row">
        <div class="stat-card" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
          <span class="label">任务总数</span><span class="val">{{ stats.total }}</span>
        </div>
        <div class="stat-card" :class="{ active: currentFilter === 'running' }" @click="setFilter('running')">
          <span class="label">执行中</span><span class="val text-blue">{{ stats.running }}</span>
        </div>
        <div class="stat-card" :class="{ active: currentFilter === 'failed' }" @click="setFilter('failed')">
          <span class="label">已失败</span><span class="val text-red">{{ stats.failed }}</span>
        </div>
        <div class="stat-card" :class="{ active: currentFilter === 'success' }" @click="setFilter('success')">
          <span class="label">已完成</span><span class="val text-green">{{ stats.success }}</span>
        </div>
      </div>
    </header>

    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="left-tools">
          <span class="current-filter-label">当前视图：{{ currentFilter === 'all' ? '全部任务' : currentFilter === 'running' ? '执行中' : currentFilter === 'failed' ? '异常任务' : '已完成' }}</span>
        </div>
        <div class="right-tools">
          <button class="icon-btn" title="刷新">🔄</button>
          <input type="text" placeholder="搜索任务 ID..." class="search-input" />
        </div>
      </div>

      <div class="table-scroll-area">
        <table class="custom-table">
          <thead>
            <tr>
              <th width="150">任务 ID</th>
              <th>关联分镜</th>
              <th width="120">任务类型</th>
              <th width="120">状态</th>
              <th width="240">当前进度</th>
              <th width="100">耗时</th>
              <th width="80" align="center">详情</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredList" :key="task.id" :class="{'row-error': task.status === 'failed'}">
              <td class="font-mono">{{ task.id }}</td>
              <td class="font-bold">{{ task.shotName }}</td>
              <td><span class="type-badge">{{ task.type }}</span></td>
              <td>
                <div class="status-badge" :class="getStatusColor(task.status)">
                  <span class="dot"></span>{{ getStatusText(task.status) }}
                </div>
              </td>
              <td>
                <div class="progress-container">
                  <div class="progress-bg">
                    <div class="progress-fill" :class="getStatusColor(task.status)" :style="{ width: task.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ Math.floor(task.progress) }}%</span>
                </div>
              </td>
              <td class="text-gray">{{ task.duration }}</td>
              <td align="center">
                <button class="btn-detail" @click="openDetails(task)">查看</button>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="7" class="empty-state">暂无相关任务数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="drawer-mask" v-if="showDrawer" @click.self="showDrawer = false">
      <div class="drawer-content">
        <div class="drawer-header">
          <div><h3>任务详情</h3><span class="task-id-tag">{{ activeTask?.id }}</span></div>
          <button class="close-btn" @click="showDrawer = false">×</button>
        </div>
        <div class="drawer-body">
          <div class="timeline-box">
            <h4>执行记录</h4>
            <div class="timeline-list">
              <div v-for="(log, idx) in taskDetails" :key="idx" class="timeline-item">
                <div class="time">{{ log.time }}</div>
                <div class="node" :class="log.type"></div>
                <div class="msg" :class="log.type">{{ log.msg }}</div>
              </div>
              <div class="timeline-item typing" v-if="activeTask?.status === 'running'">
                <div class="time">...</div>
                <div class="node running"></div>
                <div class="msg">正在执行中...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="drawer-footer">
          <button class="btn-outline" v-if="activeTask?.status === 'failed'">重试任务</button>
          <button class="btn-outline" v-if="activeTask?.status === 'running'">取消任务</button>
          <button class="btn-solid" @click="showDrawer = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-center-container { height: 100%; display: flex; flex-direction: column; padding: 20px 40px; box-sizing: border-box; background: #0f0f0f; color: #e0e0e0; }
.dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; }
.title-block h2 { margin: 0; font-size: 24px; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; display: block; }
.stats-row { display: flex; gap: 20px; }
.stat-card { display: flex; flex-direction: column; align-items: flex-end; padding: 10px 15px; border-radius: 8px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
.stat-card:hover { background: #1a1a1a; }
.stat-card.active { background: #202020; border-color: #409EFF; }
.stat-card.active .label { color: #fff; }
.stat-card .label { font-size: 12px; color: #666; margin-bottom: 4px; }
.stat-card .val { font-size: 24px; font-weight: bold; line-height: 1; font-family: 'Segoe UI', sans-serif; }
.text-blue { color: #409EFF; }
.text-green { color: #67C23A; }
.text-red { color: #F56C6C; }
.table-wrapper { flex: 1; display: flex; flex-direction: column; background: #1a1a1a; border-radius: 8px; border: 1px solid #2a2a2a; overflow: hidden; }
.table-toolbar { height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; border-bottom: 1px solid #2a2a2a; background: #202020; }
.current-filter-label { font-size: 13px; color: #ccc; }
.right-tools { display: flex; gap: 10px; align-items: center; }
.search-input { background: #111; border: 1px solid #333; color: #ccc; padding: 6px 10px; border-radius: 4px; font-size: 12px; outline: none; width: 180px; }
.icon-btn { background: none; border: none; color: #888; cursor: pointer; font-size: 16px; }
.icon-btn:hover { color: #fff; }
.table-scroll-area { flex: 1; overflow-y: auto; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
.custom-table th { position: sticky; top: 0; background: #202020; color: #888; font-weight: 600; padding: 12px 15px; border-bottom: 1px solid #2a2a2a; font-size: 12px; }
.custom-table td { padding: 12px 15px; border-bottom: 1px solid #252525; color: #ccc; vertical-align: middle; }
.custom-table tr:hover td { background: #252525; }
.empty-state { text-align: center; color: #666; padding: 40px; }
.font-mono { font-family: monospace; color: #888; font-size: 12px; }
.font-bold { font-weight: 600; color: #eee; }
.type-badge { border: 1px solid #444; color: #aaa; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
.status-badge.gray { background: rgba(255,255,255,0.05); color: #888; } .status-badge.gray .dot { background: #888; }
.status-badge.blue { background: rgba(64, 158, 255, 0.1); color: #409EFF; } .status-badge.blue .dot { background: #409EFF; box-shadow: 0 0 5px #409EFF; }
.status-badge.green { background: rgba(103, 194, 58, 0.1); color: #67C23A; } .status-badge.green .dot { background: #67C23A; }
.status-badge.red { background: rgba(245, 108, 108, 0.1); color: #F56C6C; } .status-badge.red .dot { background: #F56C6C; }
.progress-container { display: flex; align-items: center; gap: 10px; }
.progress-bg { flex: 1; height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
.progress-fill.blue { background: #409EFF; }
.progress-fill.green { background: #67C23A; }
.progress-fill.red { background: #F56C6C; }
.progress-text { font-size: 12px; color: #666; width: 35px; text-align: right; }
.btn-detail { background: transparent; border: 1px solid #444; color: #ccc; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; transition: 0.2s; }
.btn-detail:hover { border-color: #409EFF; color: #409EFF; }
.drawer-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; justify-content: flex-end; backdrop-filter: blur(2px); }
.drawer-content { width: 450px; background: #1a1a1a; border-left: 1px solid #333; display: flex; flex-direction: column; box-shadow: -5px 0 20px rgba(0,0,0,0.5); animation: slideIn 0.3s ease-out; }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.drawer-header { height: 60px; padding: 0 20px; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center; background: #202020; }
.drawer-header h3 { margin: 0; font-size: 16px; color: #fff; }
.task-id-tag { font-size: 12px; color: #666; font-family: monospace; display: block; margin-top: 4px; }
.close-btn { background: none; border: none; color: #888; font-size: 24px; cursor: pointer; }
.drawer-body { flex: 1; padding: 20px; overflow-y: auto; }
.timeline-box h4 { margin: 0 0 15px 0; font-size: 14px; color: #ccc; }
.timeline-list { display: flex; flex-direction: column; gap: 15px; border-left: 2px solid #333; padding-left: 20px; margin-left: 10px; }
.timeline-item { position: relative; }
.timeline-item .time { font-size: 11px; color: #666; margin-bottom: 2px; }
.timeline-item .node { position: absolute; left: -25px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: #444; border: 2px solid #1a1a1a; }
.timeline-item .node.info { background: #409EFF; }
.timeline-item .node.error { background: #F56C6C; }
.timeline-item .node.success { background: #67C23A; }
.timeline-item .node.running { background: #E6A23C; box-shadow: 0 0 5px #E6A23C; }
.timeline-item .msg { font-size: 13px; color: #ddd; }
.timeline-item .msg.error { color: #F56C6C; }
.drawer-footer { padding: 15px 20px; border-top: 1px solid #2a2a2a; display: flex; justify-content: flex-end; gap: 10px; background: #202020; }
.btn-outline { background: transparent; border: 1px solid #555; color: #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.btn-solid { background: #409EFF; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
</style>