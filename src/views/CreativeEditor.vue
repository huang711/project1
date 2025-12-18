<script setup>
import { ref } from 'vue'

// ==========================================
// 状态管理
// ==========================================

const viewMode = ref('library') // library | editor
const currentScript = ref(null)

// 模拟深色风格剧本封面
const scripts = ref([
  { id: 1, title: "暗夜行动", date: "2025-01-10", cover: "https://via.placeholder.com/300/1a1a1a/555?text=Dark+Ops" },
  { id: 2, title: "赛博侦探", date: "2025-02-14", cover: "https://via.placeholder.com/300/0f0f0f/333?text=Cyber" },
  { id: 3, title: "荒原求生", date: "2025-03-01", cover: "https://via.placeholder.com/300/252525/666?text=Survival" }
])

const scriptText = ref("场景：第10区-地下黑市\n时间：深夜\n人物：K（义体改造人），掮客\n\n[镜头1]\n霓虹灯在雨水中倒映出破碎的光斑。K 推开锈迹斑斑的铁门，蒸汽喷涌而出。\n掮客坐在阴影里，把玩着一枚芯片：\"你来晚了。\"")

const shots = ref([
  { 
    id: 1, desc: "霓虹灯在雨水中倒映出破碎的光斑", 
    prompt: "Cyberpunk street, rain, neon reflection, broken light, cinematic lighting...", 
    shotType: "特写", angle: "俯拍", lighting: "赛博霓虹" 
  },
  {
    id: 2, desc: "K 推开锈迹斑斑的铁门",
    prompt: "Cyborg hand pushing rusty iron door, steam rising...",
    shotType: "中景", angle: "平视", lighting: "冷光"
  }
])

// AI 弹窗
const showAIModal = ref(false)
const selectedModel = ref('gpt-4')

// ==========================================
// 交互逻辑
// ==========================================
const openScript = (script) => {
  currentScript.value = script
  viewMode.value = 'editor'
}

const triggerAI = () => showAIModal.value = true
const confirmAI = () => {
  showAIModal.value = false
  alert('任务已提交至【任务中控台】！状态：执行中')
}

// 简单的辅助函数
const deleteShot = (index) => shots.value.splice(index, 1)
const cloneShot = (index) => shots.value.push({...shots.value[index], id: Date.now()})

</script>

<template>
  <div class="creative-page">
    
    <div v-if="viewMode === 'library'" class="library-container">
      <div class="page-header">
        <h2>剧本创作库</h2>
        <div class="header-actions">
          <button class="btn-secondary">导入本地</button>
          <button class="btn-primary">＋ 新建剧本</button>
        </div>
      </div>

      <div class="script-grid">
        <div v-for="s in scripts" :key="s.id" class="script-card" @click="openScript(s)">
          <div class="cover-box">
            <img :src="s.cover" />
            <div class="hover-action">点击编辑</div>
          </div>
          <div class="info-box">
            <div class="title">{{ s.title }}</div>
            <div class="date">{{ s.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="editor-container">
      <header class="editor-toolbar">
        <div class="left">
          <button @click="viewMode='library'" class="btn-icon">←</button>
          <span class="curr-title">{{ currentScript.title }}</span>
        </div>
        <div class="right">
          <button class="btn-primary" @click="triggerAI">⚡ AI 剧本拆解</button>
        </div>
      </header>

      <div class="editor-body">
        <div class="panel text-panel">
          <div class="panel-head">📝 剧本原文</div>
          <textarea v-model="scriptText" placeholder="在此输入剧本..."></textarea>
        </div>

        <div class="panel shots-panel">
          <div class="panel-head">
            <span>分镜拆解结果 ({{ shots.length }})</span>
          </div>
          <div class="shots-list">
            <div v-for="(shot, idx) in shots" :key="shot.id" class="shot-item">
              <div class="shot-meta">
                <span class="shot-idx">#{{ idx+1 }}</span>
                <div class="shot-ctl">
                  <button @click="cloneShot(idx)">📑</button>
                  <button @click="deleteShot(idx)" class="danger">🗑️</button>
                </div>
              </div>
              <div class="shot-content">
                <p class="shot-desc">{{ shot.desc }}</p>
                <div class="shot-tags">
                  <span>{{ shot.shotType }}</span>
                  <span>{{ shot.angle }}</span>
                  <span>{{ shot.lighting }}</span>
                </div>
                <div class="prompt-preview">{{ shot.prompt }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAIModal" class="modal-mask">
      <div class="modal-box">
        <h3>启动 AI 拆解任务</h3>
        <p class="hint">任务将提交至后台队列，请在左侧【任务中控台】查看进度。</p>
        <div class="model-select">
          <label :class="{active: selectedModel==='gpt-4'}">
            <input type="radio" v-model="selectedModel" value="gpt-4"> GPT-4 Turbo
          </label>
          <label :class="{active: selectedModel==='claude'}">
            <input type="radio" v-model="selectedModel" value="claude"> Claude 3 Opus
          </label>
        </div>
        <div class="modal-foot">
          <button @click="showAIModal=false" class="btn-secondary">取消</button>
          <button @click="confirmAI" class="btn-primary">提交任务</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 深色模式页面容器 */
.creative-page { height: 100%; background: #0f0f0f; color: #e0e0e0; display: flex; flex-direction: column; overflow: hidden; }

/* 按钮通用 */
button { cursor: pointer; border: none; border-radius: 4px; font-size: 13px; transition: 0.2s; }
.btn-primary { background: #409EFF; color: white; padding: 8px 16px; font-weight: 500; }
.btn-primary:hover { background: #66b1ff; }
.btn-secondary { background: transparent; border: 1px solid #444; color: #ccc; padding: 7px 15px; }
.btn-secondary:hover { border-color: #666; color: white; }
.btn-icon { background: none; color: #888; font-size: 18px; padding: 0 10px; }
.btn-icon:hover { color: white; }

/* 1. 剧本库样式 */
.library-container { padding: 40px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; }
.header-actions { display: flex; gap: 10px; }

.script-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
.script-card { background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid #2a2a2a; cursor: pointer; transition: 0.2s; }
.script-card:hover { transform: translateY(-5px); border-color: #409EFF; }
.cover-box { width: 100%; padding-top: 100%; position: relative; background: #000; }
.cover-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.hover-action { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.6); opacity: 0; transition: 0.2s; font-weight: bold; }
.script-card:hover .hover-action { opacity: 1; }
.info-box { padding: 12px; }
.info-box .title { font-weight: bold; margin-bottom: 4px; color: #fff; }
.info-box .date { font-size: 12px; color: #666; }

/* 2. 编辑器样式 */
.editor-container { display: flex; flex-direction: column; height: 100%; }
.editor-toolbar { height: 50px; background: #1a1a1a; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; }
.left { display: flex; align-items: center; gap: 10px; }
.curr-title { font-weight: bold; font-size: 14px; }

.editor-body { flex: 1; display: flex; padding: 15px; gap: 15px; overflow: hidden; }
.panel { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; display: flex; flex-direction: column; }
.panel-head { padding: 10px 15px; background: #202020; font-size: 13px; font-weight: bold; color: #ccc; border-bottom: 1px solid #2a2a2a; }

.text-panel { flex: 1; }
.text-panel textarea { flex: 1; background: #111; border: none; color: #ddd; padding: 15px; resize: none; outline: none; font-family: inherit; line-height: 1.6; }

.shots-panel { flex: 1; }
.shots-list { flex: 1; overflow-y: auto; padding: 10px; }
.shot-item { background: #252525; border-radius: 6px; padding: 12px; margin-bottom: 10px; display: flex; gap: 10px; border-left: 3px solid #409EFF; }
.shot-meta { display: flex; flex-direction: column; justify-content: space-between; align-items: center; color: #666; font-size: 12px; }
.shot-ctl button { background: none; color: #666; padding: 2px; }
.shot-ctl button:hover { color: #fff; }
.shot-ctl button.danger:hover { color: #F56C6C; }

.shot-content { flex: 1; }
.shot-desc { margin: 0 0 8px 0; font-size: 14px; color: #fff; }
.shot-tags span { display: inline-block; background: #333; color: #aaa; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-right: 5px; }
.prompt-preview { margin-top: 8px; font-size: 12px; color: #555; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Modal */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 200; }
.modal-box { background: #252525; padding: 25px; border-radius: 8px; width: 400px; border: 1px solid #444; }
.modal-box h3 { margin-top: 0; }
.hint { color: #888; font-size: 13px; margin-bottom: 20px; }
.model-select { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
.model-select label { background: #1a1a1a; padding: 12px; border: 1px solid #333; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; }
.model-select label.active { border-color: #409EFF; background: rgba(64, 158, 255, 0.1); }
.modal-foot { display: flex; justify-content: flex-end; gap: 10px; }
</style>