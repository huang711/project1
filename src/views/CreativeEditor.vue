<script setup>
import { ref, reactive } from 'vue'

// ==========================================
// 1. 状态管理
// ==========================================

const viewMode = ref('library') // library | editor
const currentScript = ref(null)

// 专业分镜预设参数
const PRESETS = {
  shotTypes: ['特写 (CU)', '近景 (MS)', '中景 (MLS)', '全景 (LS)', '远景 (ELS)', '大远景 (VLS)', '微距 (Macro)'],
  angles: ['平视 (Eye-level)', '俯拍 (High Angle)', '仰拍 (Low Angle)', '侧拍 (Side)', '航拍 (Aerial)', '主观 (POV)', '过肩 (OTS)'],
  cameras: ['固定 (Static)', '推 (Dolly In)', '拉 (Dolly Out)', '摇 (Pan)', '移 (Truck)', '跟 (Tracking)', '升降 (Boom)', '手持 (Handheld)'],
  lightings: ['自然光', '硬光', '柔光', '侧逆光', '伦勃朗光', '赛博霓虹', '剪影']
}

// 模拟深色风格剧本封面
const scripts = ref([
  { id: 1, title: "暗夜行动", date: "2025-01-10", cover: "https://via.placeholder.com/300/1a1a1a/555?text=Dark+Ops" },
  { id: 2, title: "赛博侦探", date: "2025-02-14", cover: "https://via.placeholder.com/300/0f0f0f/333?text=Cyber" },
  { id: 3, title: "荒原求生", date: "2025-03-01", cover: "https://via.placeholder.com/300/252525/666?text=Survival" }
])

const scriptText = ref("场景：第10区-地下黑市\n时间：深夜\n人物：K（义体改造人），掮客\n\n[镜头1]\n霓虹灯在雨水中倒映出破碎的光斑。K 推开锈迹斑斑的铁门，蒸汽喷涌而出。\n掮客坐在阴影里，把玩着一枚芯片：\"你来晚了。\"")

// 分镜列表 (升级为专业字段)
const shots = ref([
  { 
    id: 1, 
    shotId: "S-01", // 业务镜号
    scene: "EXT. 地下黑市 - NIGHT", // 场景标题
    desc: "霓虹灯在积水的地面反射出破碎的红蓝光斑，雨水淅淅沥沥地落下。", // 画面内容
    dialogue: "（无对白，只有雨声）", // 对白
    duration: "3s", // 时长
    shotType: "特写 (CU)", 
    angle: "俯拍 (High Angle)", 
    camera: "固定 (Static)",
    lighting: "赛博霓虹",
    sound: "环境音：雨声、远处的警笛", // 音效
    remarks: "强调地面的湿润质感" // 备注
  },
  {
    id: 2, 
    shotId: "S-02",
    scene: "EXT. 铁门前 - NIGHT",
    desc: "K 的机械义肢手部特写，用力推开锈迹斑斑的铁门，蒸汽从门缝中喷涌而出。",
    dialogue: "K：(混响) 这里的味道还是没变。",
    duration: "5s",
    shotType: "近景 (MS)", 
    angle: "平视 (Eye-level)", 
    camera: "推 (Dolly In)",
    lighting: "侧逆光",
    sound: "音效：沉重的金属摩擦声，蒸汽喷射声",
    remarks: "机械手要有做旧的磨损细节"
  }
])

const showAIModal = ref(false)
const selectedModel = ref('gpt-4')

// ==========================================
// 2. 交互逻辑
// ==========================================

const openScript = (script) => {
  currentScript.value = script
  viewMode.value = 'editor'
}

const triggerAI = () => showAIModal.value = true
const confirmAI = () => {
  showAIModal.value = false
  alert('AI 深度拆解任务已提交！正在分析剧本结构...')
}

// --- 分镜操作核心逻辑 ---

const deleteShot = (index) => {
  if(confirm('确认删除该镜头？')) shots.value.splice(index, 1)
}

const cloneShot = (index) => {
  const newShot = JSON.parse(JSON.stringify(shots.value[index]))
  newShot.id = Date.now()
  newShot.shotId += " (Copy)" // 标记副本
  shots.value.splice(index + 1, 0, newShot)
}

// 上移
const moveUp = (index) => {
  if (index > 0) {
    const temp = shots.value[index]
    shots.value[index] = shots.value[index - 1]
    shots.value[index - 1] = temp
  }
}

// 下移
const moveDown = (index) => {
  if (index < shots.value.length - 1) {
    const temp = shots.value[index]
    shots.value[index] = shots.value[index + 1]
    shots.value[index + 1] = temp
  }
}

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
          <button class="btn-primary" @click="triggerAI">⚡ AI 深度拆解</button>
        </div>
      </header>

      <div class="editor-body">
        <div class="panel text-panel">
          <div class="panel-head">📝 剧本原文</div>
          <textarea v-model="scriptText" placeholder="在此输入剧本..."></textarea>
        </div>

        <div class="panel shots-panel">
          <div class="panel-head">
            <span>分镜可视化拆解 ({{ shots.length }})</span>
          </div>
          <div class="shots-list">
            <div v-for="(shot, idx) in shots" :key="shot.id" class="shot-card-pro">
              
              <div class="shot-header">
                <div class="header-left">
                  <span class="seq-num">#{{ idx + 1 }}</span>
                  <div class="shot-id-group">
                    <label>镜号</label>
                    <input v-model="shot.shotId" class="id-input" placeholder="S-01" />
                  </div>
                  <div class="scene-group">
                    <label>场景</label>
                    <input v-model="shot.scene" class="scene-input" placeholder="INT./EXT. 场景名 - TIME" />
                  </div>
                </div>
                <div class="shot-actions">
                  <button @click="moveUp(idx)" :disabled="idx === 0" title="上移">⬆️</button>
                  <button @click="moveDown(idx)" :disabled="idx === shots.length - 1" title="下移">⬇️</button>
                  <div class="divider"></div>
                  <button @click="cloneShot(idx)" title="克隆">📑</button>
                  <button @click="deleteShot(idx)" class="danger" title="删除">🗑️</button>
                </div>
              </div>

              <div class="shot-content-grid">
                <div class="content-col">
                  <label>画面描述 (Action)</label>
                  <textarea v-model="shot.desc" rows="3" class="dark-input" placeholder="描述画面中发生的动作、细节..."></textarea>
                </div>
                <div class="content-col">
                  <label>对白/旁白 (Dialogue)</label>
                  <textarea v-model="shot.dialogue" rows="3" class="dark-input" placeholder="角色台词或画外音..."></textarea>
                </div>
              </div>

              <div class="shot-tech-grid">
                <div class="tech-item">
                  <label>景别</label>
                  <select v-model="shot.shotType" class="dark-select">
                    <option v-for="opt in PRESETS.shotTypes" :key="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="tech-item">
                  <label>角度</label>
                  <select v-model="shot.angle" class="dark-select">
                    <option v-for="opt in PRESETS.angles" :key="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="tech-item">
                  <label>运镜</label>
                  <select v-model="shot.camera" class="dark-select">
                    <option v-for="opt in PRESETS.cameras" :key="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="tech-item">
                  <label>时长</label>
                  <input v-model="shot.duration" class="dark-input center-text" placeholder="3s" />
                </div>
              </div>

              <div class="shot-footer-grid">
                <div class="footer-item">
                  <span class="icon">🎵</span>
                  <input v-model="shot.sound" class="dark-input-ghost" placeholder="音效/音乐..." />
                </div>
                <div class="footer-item">
                  <span class="icon">📝</span>
                  <input v-model="shot.remarks" class="dark-input-ghost" placeholder="备注/注意事项..." />
                </div>
              </div>

            </div>
            
            <button class="add-shot-btn" @click="cloneShot(shots.length - 1)">＋ 添加新镜头行</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAIModal" class="modal-mask">
      <div class="modal-box">
        <h3>启动 AI 拆解任务</h3>
        <p class="hint">系统将自动分析剧本，提取场景、对白、动作并推荐运镜方案。</p>
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
          <button @click="confirmAI" class="btn-primary">开始拆解</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 全局容器 */
.creative-page { height: 100%; background: #0f0f0f; color: #e0e0e0; display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', sans-serif; }

/* 按钮通用 */
button { cursor: pointer; border: none; border-radius: 4px; font-size: 13px; transition: 0.2s; }
.btn-primary { background: #409EFF; color: white; padding: 8px 16px; font-weight: 500; }
.btn-primary:hover { background: #66b1ff; }
.btn-secondary { background: transparent; border: 1px solid #444; color: #ccc; padding: 7px 15px; }
.btn-secondary:hover { border-color: #666; color: white; }
.btn-icon { background: none; color: #888; font-size: 18px; padding: 0 10px; }
.btn-icon:hover { color: white; }

/* 1. 剧本库视图 */
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

/* 2. 编辑器视图 */
.editor-container { display: flex; flex-direction: column; height: 100%; }
.editor-toolbar { height: 50px; background: #1a1a1a; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; flex-shrink: 0; }
.left { display: flex; align-items: center; gap: 10px; }
.curr-title { font-weight: bold; font-size: 14px; }

.editor-body { flex: 1; display: flex; padding: 15px; gap: 15px; overflow: hidden; }
.panel { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; display: flex; flex-direction: column; }
.panel-head { padding: 10px 15px; background: #202020; font-size: 13px; font-weight: bold; color: #ccc; border-bottom: 1px solid #2a2a2a; }

/* 左侧文本区 */
.text-panel { flex: 1; min-width: 300px; }
.text-panel textarea { 
  flex: 1; background: #111; border: none; color: #ddd; padding: 15px; 
  resize: none; outline: none; font-family: inherit; line-height: 1.6; font-size: 14px;
}

/* 右侧分镜区 */
.shots-panel { flex: 1.8; background: #151515; }
.shots-list { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; }

/* === 专业分镜卡片 (Pro Card) === */
.shot-card-pro {
  background: #252525;
  border-radius: 6px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.shot-card-pro:hover { border-color: #555; }
.shot-card-pro:focus-within { border-color: #409EFF; }

/* 1. 顶部栏 */
.shot-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; border-bottom: 1px solid #333; background: #2a2a2a;
  border-radius: 6px 6px 0 0;
}
.header-left { display: flex; align-items: center; gap: 15px; flex: 1; }
.seq-num { font-weight: bold; font-size: 14px; color: #409EFF; min-width: 30px; }

.shot-id-group, .scene-group { display: flex; align-items: center; gap: 6px; }
.shot-id-group label, .scene-group label { font-size: 11px; color: #888; white-space: nowrap; }
.id-input { width: 60px; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 12px; }
.scene-input { width: 200px; background: #1a1a1a; border: 1px solid #444; color: #bbb; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }

.shot-actions { display: flex; align-items: center; gap: 4px; }
.shot-actions button { background: transparent; color: #888; padding: 2px 6px; font-size: 14px; }
.shot-actions button:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.1); }
.shot-actions button.danger:hover { color: #F56C6C; }
.divider { width: 1px; height: 12px; background: #444; margin: 0 4px; }

/* 2. 核心内容区 */
.shot-content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #333; }
.content-col label { display: block; font-size: 11px; color: #888; margin-bottom: 4px; }
.dark-input { 
  background: #181818; border: 1px solid #333; color: #eee; 
  padding: 8px; border-radius: 4px; font-size: 13px; font-family: inherit; 
  resize: vertical; outline: none; width: 100%; box-sizing: border-box; 
}
.dark-input:focus { border-color: #409EFF; background: #111; }

/* 3. 技术参数区 */
.shot-tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 10px; border-bottom: 1px solid #333; background: #222; }
.tech-item label { display: block; font-size: 10px; color: #666; margin-bottom: 2px; }
.dark-select { 
  width: 100%; background: #181818; border: 1px solid #333; color: #ccc; 
  padding: 4px; border-radius: 4px; font-size: 12px; outline: none; 
}
.dark-select:focus { border-color: #409EFF; }
.center-text { text-align: center; }

/* 4. 底部信息 */
.shot-footer-grid { display: flex; gap: 15px; padding: 8px 12px; background: #252525; border-radius: 0 0 6px 6px; }
.footer-item { flex: 1; display: flex; align-items: center; gap: 8px; }
.footer-item .icon { font-size: 14px; opacity: 0.6; }
.dark-input-ghost { 
  flex: 1; background: transparent; border: none; border-bottom: 1px dashed #444; 
  color: #aaa; font-size: 12px; padding: 2px 0; outline: none; 
}
.dark-input-ghost:focus { border-bottom-color: #409EFF; color: #fff; }

.add-shot-btn {
  padding: 12px; background: #1a1a1a; border: 1px dashed #444; color: #888;
  border-radius: 6px; width: 100%; margin-top: 10px; transition: 0.2s;
}
.add-shot-btn:hover { border-color: #409EFF; color: #409EFF; background: #202020; }

/* Modal */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 200; }
.modal-box { background: #252525; padding: 25px; border-radius: 8px; width: 400px; border: 1px solid #444; }
.modal-box h3 { margin-top: 0; color: #fff; }
.hint { color: #888; font-size: 13px; margin-bottom: 20px; }
.model-select { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
.model-select label { background: #1a1a1a; padding: 12px; border: 1px solid #333; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; color: #eee; }
.model-select label.active { border-color: #409EFF; background: rgba(64, 158, 255, 0.1); }
.modal-foot { display: flex; justify-content: flex-end; gap: 10px; }
</style>