<script setup>
import { ref, reactive } from 'vue'

// ==========================================
// 1. 基础状态与数据
// ==========================================

const currentScript = ref({ title: "第1集：顾清寒的决断" })

// 模拟分镜数据
const shots = ref(Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Shot ${String(i + 1).padStart(2, '0')}`,
  duration: '3.0s',
  status: i === 0 ? 'Editing' : 'Waiting',
  prompt: "顾清寒站在落地窗前，眼神冷冽...",
  // 参数状态
  params: {
    shotType: '中景',
    angle: '平视',
    lighting: '自然光'
  },
  // 是否处于自定义输入模式
  isCustom: { shotType: false, angle: false, lighting: false }
})))

const activeShotId = ref(1)
const currentShot = reactive(shots.value[0]) 

// 切换分镜
const selectShot = (id) => {
  activeShotId.value = id
  const target = shots.value.find(s => s.id === id)
  if(target) {
    // 简单模拟数据同步
    currentShot.prompt = target.prompt
    currentShot.id = target.id
    currentShot.name = target.name
    // 实际项目中应深度拷贝或引用
  }
}

// ==========================================
// 2. 资产管理逻辑 (Assets)
// ==========================================
const showAssetModal = ref(false)
const assetTab = ref('roles') // roles | scenes | props

// 模拟资产库数据
const mockAssets = {
  roles: [
    { id: 1, name: "顾清寒", img: "https://via.placeholder.com/100/34495E/FFF?text=Gu" },
    { id: 2, name: "苏浅浅", img: "https://via.placeholder.com/100/E74C3C/FFF?text=Su" },
    { id: 3, name: "神秘人", img: "https://via.placeholder.com/100/000000/FFF?text=X" }
  ],
  scenes: [
    { id: 11, name: "豪华办公室", img: "https://via.placeholder.com/100/555/FFF?text=Office" },
    { id: 12, name: "雨夜街头", img: "https://via.placeholder.com/100/333/FFF?text=Street" }
  ],
  props: [
    { id: 21, name: "咖啡杯", img: "https://via.placeholder.com/100/888/FFF?text=Cup" },
    { id: 22, name: "机密文件", img: "https://via.placeholder.com/100/DDD/000?text=File" }
  ]
}

const handleAssetSelect = (asset) => {
  currentShot.prompt += ` [${asset.name}]`
  showAssetModal.value = false
}

// ==========================================
// 3. 参数自定义逻辑 (Params)
// ==========================================
const PRESETS = {
  shotTypes: ['特写', '近景', '中景', '全景', '远景'],
  angles: ['平视', '俯拍', '仰拍', '侧拍', '航拍'],
  lightings: ['自然光', '电影光', '赛博霓虹', '伦勃朗光', '侧逆光']
}

const toggleCustomMode = (field, isCustom) => {
  if (!currentShot.isCustom) currentShot.isCustom = {}
  currentShot.isCustom[field] = isCustom
  if (!isCustom) {
    if (field === 'shotType') currentShot.params.shotType = PRESETS.shotTypes[0]
    if (field === 'angle') currentShot.params.angle = PRESETS.angles[0]
    if (field === 'lighting') currentShot.params.lighting = PRESETS.lightings[0]
  } else {
    currentShot.params[field] = ''
  }
}

const handleParamSelect = (field, e) => {
  if (e.target.value === '__custom__') {
    toggleCustomMode(field, true)
  }
}

// ==========================================
// 4. 生成配置逻辑 (Generation)
// ==========================================
const showGenModal = ref(false)
const genConfig = reactive({
  model: 'Sora-Turbo',
  duration: 5,
  resolution: '9:16'
})

const startGeneration = () => {
  showGenModal.value = false
  alert(`🚀 开始生成！\n\n模型: ${genConfig.model}\n时长: ${genConfig.duration}s\n分辨率: ${genConfig.resolution}\n提示词: ${currentShot.prompt}`)
}

</script>

<template>
  <div class="storyboard-workspace">
    
    <div class="workspace-grid">
      
      <div class="col-list">
        <div class="panel-header">
          <div class="header-info">
            <span class="script-title">{{ currentScript.title }}</span>
            <span class="shot-count">{{ shots.length }} 个镜头</span>
          </div>
          <button class="icon-btn" title="添加分镜">＋</button>
        </div>
        
        <div class="shot-scroller">
          <div 
            v-for="shot in shots" 
            :key="shot.id" 
            class="shot-card"
            :class="{ active: activeShotId === shot.id }"
            @click="selectShot(shot.id)"
          >
            <div class="shot-thumb-box">#{{ shot.id }}</div>
            <div class="shot-details">
              <span class="shot-name">{{ shot.name }}</span>
              <div class="shot-tags">
                <span class="tag-time">{{ shot.duration }}</span>
                <span class="tag-status" :class="shot.status.toLowerCase()">{{ shot.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-viewport">
        <div class="viewport-toolbar">
          <span>{{ genConfig.resolution }}</span><span class="sep">|</span>
          <span>100%</span><span class="sep">|</span>
          <span>00:00:00:00</span>
        </div>
        <div class="canvas-container">
          <div class="canvas-frame">
            <div class="placeholder-content">
              <div class="role-marker">预览区域</div>
              <div class="drop-zone">Waiting for generation...</div>
            </div>
          </div>
        </div>
        <div class="timeline-panel">
            <div class="track-header">Video Track 1</div>
            <div class="track-container">
              <div class="clip-block" v-for="s in shots" :key="s.id">S{{ s.id }}</div>
            </div>
        </div>
      </div>

      <div class="col-props">
        <div class="panel-header-simple">参数配置</div>
        
        <div class="props-body">
          
          <div class="prop-group">
            <label>关联资产 (Assets)</label>
            <button class="btn-assets" @click="showAssetModal = true">
              🗂️ 选择角色 / 场景 / 道具
            </button>
          </div>

          <div class="prop-group">
            <div class="group-header">
              <label>画面提示词 (Prompt)</label>
              <button class="btn-text-action">✨ AI 优化</button>
            </div>
            <textarea 
              v-model="currentShot.prompt" 
              class="prop-input large" 
              placeholder="描述画面内容..."
            ></textarea>
          </div>

          <div class="prop-group">
            <label>镜头参数 (Camera & Light)</label>
            
            <div class="param-row">
              <span class="param-label">景别</span>
              <div v-if="!currentShot.isCustom?.shotType" class="select-wrap">
                <select v-model="currentShot.params.shotType" @change="handleParamSelect('shotType', $event)">
                  <option v-for="o in PRESETS.shotTypes" :key="o">{{ o }}</option>
                  <option value="__custom__">✎ 自定义...</option>
                </select>
              </div>
              <div v-else class="input-wrap">
                <input v-model="currentShot.params.shotType" placeholder="输入景别..." autofocus />
                <button @click="toggleCustomMode('shotType', false)">×</button>
              </div>
            </div>

            <div class="param-row">
              <span class="param-label">角度</span>
              <div v-if="!currentShot.isCustom?.angle" class="select-wrap">
                <select v-model="currentShot.params.angle" @change="handleParamSelect('angle', $event)">
                  <option v-for="o in PRESETS.angles" :key="o">{{ o }}</option>
                  <option value="__custom__">✎ 自定义...</option>
                </select>
              </div>
              <div v-else class="input-wrap">
                <input v-model="currentShot.params.angle" placeholder="输入角度..." autofocus />
                <button @click="toggleCustomMode('angle', false)">×</button>
              </div>
            </div>

            <div class="param-row">
              <span class="param-label">光影</span>
              <div v-if="!currentShot.isCustom?.lighting" class="select-wrap">
                <select v-model="currentShot.params.lighting" @change="handleParamSelect('lighting', $event)">
                  <option v-for="o in PRESETS.lightings" :key="o">{{ o }}</option>
                  <option value="__custom__">✎ 自定义...</option>
                </select>
              </div>
              <div v-else class="input-wrap">
                <input v-model="currentShot.params.lighting" placeholder="输入光影参数..." autofocus />
                <button @click="toggleCustomMode('lighting', false)">×</button>
              </div>
            </div>

          </div>

        </div>

        <div class="props-footer">
          <button class="btn-generate-lg" @click="showGenModal = true">
            <span class="main-text">立即生成分镜</span>
            <span class="sub-text">配置生成参数...</span>
          </button>
        </div>
      </div>

    </div>

    <div v-if="showAssetModal" class="modal-overlay" @click.self="showAssetModal = false">
      <div class="modal-box asset-modal">
        <div class="modal-header">
          <h3>🗂️ 资产库选择</h3>
          <button @click="showAssetModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-tabs">
          <button :class="{active: assetTab==='roles'}" @click="assetTab='roles'">角色</button>
          <button :class="{active: assetTab==='scenes'}" @click="assetTab='scenes'">场景</button>
          <button :class="{active: assetTab==='props'}" @click="assetTab='props'">道具</button>
        </div>
        <div class="asset-grid">
          <div 
            v-for="item in mockAssets[assetTab]" 
            :key="item.id" 
            class="asset-item"
            @click="handleAssetSelect(item)"
          >
            <img :src="item.img" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGenModal" class="modal-overlay" @click.self="showGenModal = false">
      <div class="modal-box config-modal">
        <h3>🚀 生成配置</h3>
        
        <div class="config-form">
          <div class="form-item">
            <label>AI 大模型</label>
            <select v-model="genConfig.model">
              <option>Sora-Turbo</option>
              <option>Runway Gen-3</option>
              <option>Pika Art</option>
              <option>Stable Video Diffusion</option>
            </select>
          </div>

          <div class="form-item">
            <label>生成时长 (秒)</label>
            <div class="range-wrap">
              <input type="range" v-model="genConfig.duration" min="2" max="10" step="1">
              <span>{{ genConfig.duration }}s</span>
            </div>
          </div>

          <div class="form-item">
            <label>分辨率</label>
            <div class="ratio-group">
              <button :class="{active: genConfig.resolution==='9:16'}" @click="genConfig.resolution='9:16'">9:16</button>
              <button :class="{active: genConfig.resolution==='16:9'}" @click="genConfig.resolution='16:9'">16:9</button>
              <button :class="{active: genConfig.resolution==='1:1'}" @click="genConfig.resolution='1:1'">1:1</button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showGenModal = false">取消</button>
          <button class="btn-confirm" @click="startGeneration">开始生成</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ==========================================
   局部样式 - 仅负责内容区域 (Dark Mode)
   ========================================== */
.storyboard-workspace {
  width: 100%;
  height: 100%;
  background-color: #0f0f0f;
  color: #e0e0e0;
  display: flex;
}

.workspace-grid { display: flex; width: 100%; height: 100%; }

/* --- 1. 左栏: 列表 --- */
.col-list { width: 240px; background: #1a1a1a; border-right: 1px solid #2a2a2a; display: flex; flex-direction: column; }
.panel-header { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #2a2a2a; }
.header-info { display: flex; flex-direction: column; }
.script-title { font-size: 13px; font-weight: bold; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.shot-count { font-size: 11px; color: #666; }
.icon-btn { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; opacity: 0.8; }
.icon-btn:hover { opacity: 1; color: #409EFF; }

.shot-scroller { flex: 1; overflow-y: auto; padding: 10px; }
.shot-card { display: flex; gap: 10px; padding: 10px; background: #252525; border-radius: 6px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; }
.shot-card.active { border-color: #409EFF; background: #2a2d3e; }
.shot-thumb-box { width: 40px; height: 40px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #555; }
.shot-details { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.shot-name { font-size: 13px; color: #eee; }
.shot-tags { display: flex; justify-content: space-between; font-size: 11px; color: #888; }
.tag-status.editing { color: #409EFF; }

/* --- 2. 中栏: 视口 --- */
.col-viewport { flex: 1; display: flex; flex-direction: column; background: #0f0f0f; position: relative; }
.viewport-toolbar { height: 40px; background: #141414; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: center; align-items: center; gap: 15px; font-size: 12px; color: #666; }
.canvas-container { flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #1a1a1a 0%, #0f0f0f 100%); }
.canvas-frame { width: 270px; height: 480px; border: 1px solid #333; background: #000; }
.placeholder-content { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid #409EFF; color: #409EFF; }
.timeline-panel { height: 120px; background: #1a1a1a; border-top: 1px solid #2a2a2a; display: flex; flex-direction: column; }
.track-header { height: 24px; background: #222; font-size: 11px; padding: 0 10px; display: flex; align-items: center; color: #666; }
.track-container { flex: 1; display: flex; gap: 2px; padding: 10px; overflow-x: auto; }
.clip-block { width: 80px; height: 100%; background: #2c4c6b; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #a0cfff; flex-shrink: 0; }

/* --- 3. 右栏: 参数 (合并) --- */
.col-props { width: 280px; background: #1a1a1a; border-left: 1px solid #2a2a2a; display: flex; flex-direction: column; }
.panel-header-simple { height: 50px; display: flex; align-items: center; padding: 0 15px; border-bottom: 1px solid #2a2a2a; font-size: 13px; font-weight: 600; color: #ccc; }
.props-body { flex: 1; overflow-y: auto; padding: 20px; }

.prop-group { margin-bottom: 25px; }
.prop-group label { display: block; font-size: 12px; color: #888; margin-bottom: 8px; }
.group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.btn-text-action { background: none; border: none; color: #409EFF; font-size: 11px; cursor: pointer; padding: 0; }

.btn-assets { width: 100%; padding: 10px; background: #252525; border: 1px dashed #444; color: #ccc; border-radius: 6px; cursor: pointer; font-size: 13px; transition: 0.2s; text-align: center; }
.btn-assets:hover { border-color: #409EFF; color: #409EFF; background: #2a2d3e; }

.prop-input { width: 100%; background: #111; border: 1px solid #333; color: #ddd; padding: 10px; border-radius: 6px; font-size: 13px; resize: none; outline: none; box-sizing: border-box; font-family: inherit; }
.prop-input:focus { border-color: #409EFF; }
.prop-input.large { height: 100px; }

/* 参数行 */
.param-row { display: flex; align-items: center; margin-bottom: 10px; }
.param-label { width: 40px; font-size: 12px; color: #888; }
.select-wrap, .input-wrap { flex: 1; display: flex; }
.select-wrap select { width: 100%; background: #111; color: #ddd; border: 1px solid #333; padding: 6px; border-radius: 4px; outline: none; }
.input-wrap input { flex: 1; background: #111; color: #ddd; border: 1px solid #409EFF; padding: 6px; border-radius: 4px 0 0 4px; outline: none; width: 100%; }
.input-wrap button { background: #333; border: 1px solid #333; color: #aaa; border-radius: 0 4px 4px 0; cursor: pointer; padding: 0 8px; }

.props-footer { padding: 20px; border-top: 1px solid #2a2a2a; }
.btn-generate-lg { width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 14px; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; transition: 0.2s; }
.btn-generate-lg:hover { opacity: 0.9; }
.main-text { color: white; font-weight: 600; font-size: 15px; }
.sub-text { color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 4px; }

/* --- 弹窗样式 --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(2px); }
.modal-box { background: #1f1f1f; border-radius: 12px; border: 1px solid #333; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.modal-header h3 { margin: 0; color: #fff; font-size: 16px; }
.close-btn { background: none; border: none; color: #888; font-size: 20px; cursor: pointer; }

/* 资产弹窗 */
.asset-modal { width: 500px; height: 400px; display: flex; flex-direction: column; }
.modal-tabs { display: flex; gap: 10px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
.modal-tabs button { background: none; border: none; color: #666; font-size: 14px; cursor: pointer; padding: 5px 10px; border-radius: 4px; }
.modal-tabs button.active { background: #409EFF; color: white; }
.asset-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; overflow-y: auto; flex: 1; }
.asset-item { cursor: pointer; text-align: center; }
.asset-item:hover img { border-color: #409EFF; opacity: 0.8; }
.asset-item img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; border: 2px solid transparent; background: #333; margin-bottom: 5px; }
.asset-item span { font-size: 12px; color: #ccc; display: block; }

/* 配置弹窗 */
.config-modal { width: 350px; }
.config-modal h3 { margin-top: 0; color: #fff; margin-bottom: 20px; text-align: center; }
.config-form { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
.form-item label { display: block; font-size: 13px; color: #aaa; margin-bottom: 8px; }
.form-item select { width: 100%; padding: 8px; background: #111; border: 1px solid #333; color: white; border-radius: 6px; }
.range-wrap { display: flex; align-items: center; gap: 10px; }
.range-wrap input { flex: 1; }
.range-wrap span { width: 30px; text-align: right; color: #409EFF; font-weight: bold; }
.ratio-group { display: flex; gap: 10px; }
.ratio-group button { flex: 1; padding: 8px; background: #252525; border: 1px solid #333; color: #ccc; border-radius: 6px; cursor: pointer; }
.ratio-group button.active { background: #409EFF; border-color: #409EFF; color: white; }

.modal-actions { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 10px; background: transparent; border: 1px solid #333; color: #888; border-radius: 6px; cursor: pointer; }
.btn-confirm { flex: 1; padding: 10px; background: #409EFF; border: none; color: white; border-radius: 6px; cursor: pointer; font-weight: bold; }
</style>