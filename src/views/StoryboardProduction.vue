<script setup>
import { ref, reactive, computed } from 'vue'

// ==========================================
// 1. 全局状态
// ==========================================

const viewState = ref('selection') // selection | workbench
const currentScript = ref(null)

// 模拟剧本列表
const scriptList = ref([
  { id: 1, title: "第1集：顾清寒的决断", cover: "https://via.placeholder.com/300/1a1a1a/555?text=EP01" },
  { id: 2, title: "第2集：暗夜潜行", cover: "https://via.placeholder.com/300/111/333?text=EP02" }
])

// 模拟分镜列表
const shots = ref(Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Shot ${String(i + 1).padStart(2, '0')}`,
  status: i === 0 ? 'Editing' : 'Waiting',
  duration: '5s'
})))
const activeShotId = ref(1)

// ==========================================
// 2. 创作模式与资产配置
// ==========================================

const creationMode = ref('img2vid') // img2vid (图生) | frames (首尾帧) 

// 选中的资产容器
const selectedAssets = reactive({
  role: null,
  scene: null,
  prop: null,
  pose: null,
  effect: null
})

// 资产弹窗控制
const showAssetModal = ref(false)
const assetModalType = ref('role')

// 模拟资产库数据
const assetDatabase = {
  role: [
    { id: 1, name: "顾清寒", img: "https://via.placeholder.com/150/34495E/FFF?text=Role+Gu" },
    { id: 2, name: "苏浅浅", img: "https://via.placeholder.com/150/E74C3C/FFF?text=Role+Su" }
  ],
  scene: [ { id: 11, name: "豪华办公室", img: "https://via.placeholder.com/150/111/FFF?text=Office" } ],
  prop: [ { id: 21, name: "机密文件", img: "https://via.placeholder.com/150/555/FFF?text=File" } ],
  pose: [ { id: 31, name: "走路姿态", img: "https://via.placeholder.com/150/777/FFF?text=Walk" } ],
  effect: [ { id: 41, name: "下雨特效", img: "https://via.placeholder.com/150/000/FFF?text=Rain" } ]
}

// ==========================================
// 3. 结构化提示词系统 (支持自定义)
// ==========================================

// 提示词表单数据
const promptForm = reactive({
  subject: '',      // 主体描述 (文本)
  shot: '',         // 景别
  atmosphere: '',   // 氛围
  environment: '',  // 环境
  camera: '',       // 运镜
  angle: '',        // 视角
  tech: '',         // 特殊手法
  comp: '',         // 构图
  style: '',        // 风格统一
  motion: ''        // 动态控制
})

// 记录哪些字段处于“自定义输入”模式
const customState = reactive({
  shot: false,
  atmosphere: false,
  environment: false,
  camera: false,
  angle: false,
  tech: false,
  comp: false,
  style: false,
  motion: false
})

// 预设选项库
const PROMPT_OPTIONS = {
  shot: ['极特写 (Extreme Close Up)', '特写 (Close Up)', '中景 (Medium Shot)', '全景 (Full Shot)', '远景 (Long Shot)', '大远景 (Extreme Long Shot)'],
  atmosphere: ['电影感 (Cinematic)', '赛博朋克 (Cyberpunk)', '悬疑阴郁 (Gloomy)', '阳光明媚 (Sunny)', '浪漫唯美 (Romantic)', '废土风 (Wasteland)', '恐怖 (Horror)'],
  environment: ['现代都市 (Modern City)', '科幻太空 (Sci-fi Space)', '古风建筑 (Ancient)', '自然森林 (Forest)', '室内家居 (Indoor)', '极简背景 (Minimalist)', '绿幕 (Green Screen)'],
  camera: ['固定镜头 (Static)', '推镜头 (Dolly In)', '拉镜头 (Dolly Out)', '摇镜头 (Pan)', '跟随 (Tracking)', '手持晃动 (Handheld)', '环绕 (Orbit)'],
  angle: ['平视 (Eye-level)', '仰拍 (Low Angle)', '俯拍 (High Angle)', '上帝视角 (Top Down)', '第一人称 (POV)', '过肩视点 (Over-the-shoulder)'],
  tech: ['浅景深/虚化 (Bokeh)', '慢动作 (Slow Motion)', '延时摄影 (Time-lapse)', '长曝光 (Long Exposure)', '运动模糊 (Motion Blur)', '鱼眼镜头 (Fisheye)'],
  comp: ['中心构图 (Center)', '三分法 (Rule of Thirds)', '对称构图 (Symmetrical)', '黄金分割 (Golden Ratio)', '对角线构图 (Diagonal)'],
  style: ['写实照片级 (Photorealistic)', '虚幻引擎5 (Unreal Engine 5)', '二次元动漫 (Anime)', '皮克斯风格 (Pixar)', '水墨中国风 (Ink style)', '油画风格 (Oil Painting)'],
  motion: ['低动态 (Low Motion)', '中等动态 (Medium Motion)', '高动态 (High Motion)', '平滑运动 (Smooth)', '剧烈运动 (Intense)']
}

// 处理参数下拉框变化
const handleParamChange = (field, event) => {
  const val = event.target.value
  if (val === '__custom__') {
    // 切换到自定义模式
    customState[field] = true
    promptForm[field] = '' // 清空以便输入
  } else if (val === '') {
    // 选择无
    promptForm[field] = ''
  } else {
    // 选择预设
    promptForm[field] = val
  }
}

// 退出自定义模式，重置为“无”
const exitCustomMode = (field) => {
  customState[field] = false
  promptForm[field] = ''
}

// 计算最终组合的提示词
const finalPrompt = computed(() => {
  const parts = [
    promptForm.subject ? `Subject: ${promptForm.subject}` : '',
    promptForm.shot ? `Shot: ${promptForm.shot}` : '',
    promptForm.atmosphere ? `Atmosphere: ${promptForm.atmosphere}` : '',
    promptForm.environment ? `Env: ${promptForm.environment}` : '',
    promptForm.camera ? `Camera: ${promptForm.camera}` : '',
    promptForm.angle ? `Angle: ${promptForm.angle}` : '',
    promptForm.tech ? `Tech: ${promptForm.tech}` : '',
    promptForm.comp ? `Comp: ${promptForm.comp}` : '',
    promptForm.style ? `Style: ${promptForm.style}` : '',
    promptForm.motion ? `Motion: ${promptForm.motion}` : ''
  ]
  return parts.filter(p => p !== '').join(', ')
})

// 生成参数配置
const genConfig = reactive({
  model: 'Sora-Turbo',
  duration: 5,        // 5, 10, 15
  ratio: '16:9',
  count: 1,           // 1-5
})

const PRESETS = {
  ratios: ['16:9', '9:16', '1:1', '2.35:1']
}

// ==========================================
// 4. 方法逻辑
// ==========================================

const enterWorkspace = (script) => {
  currentScript.value = script
  viewState.value = 'workbench'
}

const openAssetSelector = (type) => {
  assetModalType.value = type
  showAssetModal.value = true
}

const confirmAssetSelect = (asset) => {
  selectedAssets[assetModalType.value] = asset
  if (['role', 'prop'].includes(assetModalType.value)) {
    const appendText = ` [${asset.name}]`
    if (!promptForm.subject.includes(appendText)) {
      promptForm.subject += appendText
    }
  }
  showAssetModal.value = false
}

const handleLocalUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    alert(`已选择本地文件: ${file.name} (模拟上传)`)
    showAssetModal.value = false
  }
}

const startGeneration = () => {
  alert(`🚀 任务提交成功！\n模式: ${creationMode.value}\n模型: ${genConfig.model}\n完整Prompt: \n${finalPrompt.value}`)
}

</script>

<template>
  <div class="page-container">
    
    <div v-if="viewState === 'selection'" class="selection-view">
      <h2>请选择分镜制作剧本</h2>
      <div class="script-grid">
        <div v-for="s in scriptList" :key="s.id" class="script-item" @click="enterWorkspace(s)">
          <img :src="s.cover" />
          <div class="title">{{ s.title }}</div>
        </div>
      </div>
    </div>

    <div v-else class="workbench-view">
      
      <div class="col-left">
        <div class="panel-header">
          <span>分镜序列</span>
          <small>{{ currentScript.title }}</small>
        </div>
        <div class="shot-list">
          <div 
            v-for="shot in shots" 
            :key="shot.id" 
            class="shot-card" 
            :class="{active: activeShotId === shot.id}"
            @click="activeShotId = shot.id"
          >
            <div class="shot-idx">#{{ shot.id }}</div>
            <div class="shot-info">
              <span class="name">{{ shot.name }}</span>
              <span class="dur">{{ shot.duration }}</span>
            </div>
            <div class="status-dot" :class="shot.status === 'Editing' ? 'blue' : 'gray'"></div>
          </div>
        </div>
      </div>

      <div class="col-center">
        <div class="preview-container">
          <div class="preview-header">
            <span>{{ genConfig.ratio }}</span>
            <span>HD Preview</span>
          </div>
          <div class="canvas-box">
            <div class="empty-placeholder">
              <div class="icon">🎬</div>
              <div class="text">参数配置就绪</div>
              <div class="sub-text" v-if="finalPrompt">
                {{ finalPrompt }}
              </div>
              <div class="sub-text" v-else>请在右侧配置画面参数...</div>
            </div>
          </div>
          <div class="simple-controls">
            <button class="btn-icon">◀</button>
            <button class="btn-icon">▶</button>
            <span class="time-code">00:00 / 00:00</span>
          </div>
        </div>
      </div>

      <div class="col-right">
        
        <div class="mode-tabs">
          <button :class="{active: creationMode === 'img2vid'}" @click="creationMode = 'img2vid'">图生视频</button>
          <button :class="{active: creationMode === 'frames'}" @click="creationMode = 'frames'">首尾帧</button>
        </div>

        <div class="config-scroller">
          
          <div class="section-block">
            <div class="section-title">参考资产配置</div>
            
            <div v-if="creationMode === 'img2vid'" class="asset-slots">
              <div class="slot-item" @click="openAssetSelector('role')">
                <div class="slot-box" :class="{filled: selectedAssets.role}">
                  <img v-if="selectedAssets.role" :src="selectedAssets.role.img" />
                  <span v-else>👤</span>
                </div>
                <span class="slot-label">角色</span>
              </div>
              <div class="slot-item" @click="openAssetSelector('scene')">
                <div class="slot-box" :class="{filled: selectedAssets.scene}">
                  <img v-if="selectedAssets.scene" :src="selectedAssets.scene.img" />
                  <span v-else>🏙️</span>
                </div>
                <span class="slot-label">场景</span>
              </div>
              <div class="slot-item" @click="openAssetSelector('prop')">
                <div class="slot-box" :class="{filled: selectedAssets.prop}">
                  <img v-if="selectedAssets.prop" :src="selectedAssets.prop.img" />
                  <span v-else>📦</span>
                </div>
                <span class="slot-label">物品</span>
              </div>
              <div class="slot-item" @click="openAssetSelector('pose')">
                <div class="slot-box" :class="{filled: selectedAssets.pose}">
                  <img v-if="selectedAssets.pose" :src="selectedAssets.pose.img" />
                  <span v-else>💃</span>
                </div>
                <span class="slot-label">姿态</span>
              </div>
              <div class="slot-item" @click="openAssetSelector('effect')">
                <div class="slot-box" :class="{filled: selectedAssets.effect}">
                  <img v-if="selectedAssets.effect" :src="selectedAssets.effect.img" />
                  <span v-else>✨</span>
                </div>
                <span class="slot-label">特效</span>
              </div>
            </div>

            <div v-else class="keyframes-slots">
              <div class="kf-upload">
                <div class="upload-box">Start Frame</div>
                <span>上传首帧</span>
              </div>
              <div class="arrow">➔</div>
              <div class="kf-upload">
                <div class="upload-box">End Frame</div>
                <span>上传尾帧</span>
              </div>
            </div>
          </div>

          <div class="section-block">
            <div class="section-title">画面提示词构建</div>
            
            <div class="prompt-builder">
              <div class="form-row full-width">
                <label>主体描述 (Subject)</label>
                <textarea 
                  v-model="promptForm.subject" 
                  rows="5" 
                  class="dark-input area" 
                  placeholder="描述画面中的核心人物、动作或物体..."
                ></textarea>
              </div>

              <div class="param-grid">
                
                <div class="grid-item">
                  <label>景别</label>
                  <div v-if="!customState.shot" class="select-wrap">
                    <select :value="promptForm.shot || ''" @change="handleParamChange('shot', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.shot" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.shot" placeholder="输入景别..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('shot')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>环境</label>
                  <div v-if="!customState.environment" class="select-wrap">
                    <select :value="promptForm.environment || ''" @change="handleParamChange('environment', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.environment" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.environment" placeholder="输入环境..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('environment')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>氛围</label>
                  <div v-if="!customState.atmosphere" class="select-wrap">
                    <select :value="promptForm.atmosphere || ''" @change="handleParamChange('atmosphere', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.atmosphere" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.atmosphere" placeholder="输入氛围..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('atmosphere')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>运镜</label>
                  <div v-if="!customState.camera" class="select-wrap">
                    <select :value="promptForm.camera || ''" @change="handleParamChange('camera', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.camera" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.camera" placeholder="输入运镜..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('camera')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>视角</label>
                  <div v-if="!customState.angle" class="select-wrap">
                    <select :value="promptForm.angle || ''" @change="handleParamChange('angle', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.angle" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.angle" placeholder="输入视角..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('angle')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>特殊手法</label>
                  <div v-if="!customState.tech" class="select-wrap">
                    <select :value="promptForm.tech || ''" @change="handleParamChange('tech', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.tech" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.tech" placeholder="输入手法..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('tech')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>构图</label>
                  <div v-if="!customState.comp" class="select-wrap">
                    <select :value="promptForm.comp || ''" @change="handleParamChange('comp', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.comp" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.comp" placeholder="输入构图..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('comp')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>风格统一</label>
                  <div v-if="!customState.style" class="select-wrap">
                    <select :value="promptForm.style || ''" @change="handleParamChange('style', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.style" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.style" placeholder="输入风格..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('style')" class="close-input">×</button>
                  </div>
                </div>

                <div class="grid-item">
                  <label>动态控制</label>
                  <div v-if="!customState.motion" class="select-wrap">
                    <select :value="promptForm.motion || ''" @change="handleParamChange('motion', $event)" class="dark-select">
                      <option value="" class="text-gray">无</option>
                      <option v-for="opt in PROMPT_OPTIONS.motion" :key="opt" :value="opt">{{ opt }}</option>
                      <option value="__custom__" class="text-blue">✎ 自定义...</option>
                    </select>
                  </div>
                  <div v-else class="input-wrap">
                    <input v-model="promptForm.motion" placeholder="输入动态..." class="dark-input small" autofocus />
                    <button @click="exitCustomMode('motion')" class="close-input">×</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="section-block">
            <div class="section-title">生成参数</div>
            
            <div class="params-box">
              <div class="param-row">
                <label>大模型</label>
                <select v-model="genConfig.model" class="dark-input">
                  <option>Sora-Turbo</option>
                  <option>Runway Gen-3</option>
                  <option>Pika Art</option>
                  <option>Stable Video</option>
                </select>
              </div>

              <div class="param-row">
                <label>时长 (秒)</label>
                <div class="radio-group">
                  <button v-for="t in [5,10,15]" :key="t" 
                    :class="{active: genConfig.duration === t}" 
                    @click="genConfig.duration = t">{{ t }}s</button>
                </div>
              </div>

              <div class="param-row">
                <label>宽高比</label>
                <div class="radio-group">
                  <button v-for="r in PRESETS.ratios" :key="r" 
                    :class="{active: genConfig.ratio === r}" 
                    @click="genConfig.ratio = r">{{ r }}</button>
                </div>
              </div>

              <div class="param-row">
                <label>生成数量</label>
                <div class="count-selector">
                  <button v-for="n in 5" :key="n" 
                    :class="{active: genConfig.count === n}" 
                    @click="genConfig.count = n">{{ n }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-footer">
          <button class="btn-generate" @click="startGeneration">
            <span class="icon">🚀</span>
            <span>立即生成视频 ({{ genConfig.count }})</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAssetModal" class="modal-overlay" @click.self="showAssetModal = false">
      <div class="asset-modal">
        <div class="modal-header">
          <h3>选择{{ assetModalType === 'role' ? '角色' : assetModalType === 'scene' ? '场景' : '资产' }}</h3>
          <button class="close-btn" @click="showAssetModal = false">×</button>
        </div>
        
        <div class="modal-grid">
          <div class="asset-card upload-card">
            <div class="card-img-box upload-area">
              <input type="file" @change="handleLocalUpload" accept="image/*" />
              <span class="icon">☁️</span>
              <span class="hint">点击上传本地图片</span>
            </div>
            <div class="card-name">本地上传</div>
          </div>

          <div 
            v-for="item in assetDatabase[assetModalType] || []" 
            :key="item.id" 
            class="asset-card"
            @click="confirmAssetSelect(item)"
          >
            <div class="card-img-box">
              <img :src="item.img" />
            </div>
            <div class="card-name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 全局容器 */
.page-container { height: 100%; background: #0f0f0f; color: #e0e0e0; display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', sans-serif; }

/* 1. 剧本选择 */
.selection-view { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px; }
.selection-view h2 { margin-bottom: 40px; color: #fff; }
.script-grid { display: flex; gap: 30px; }
.script-item { width: 200px; cursor: pointer; transition: 0.2s; }
.script-item:hover { transform: translateY(-5px); }
.script-item img { width: 100%; height: 260px; object-fit: cover; border-radius: 8px; border: 2px solid #333; margin-bottom: 10px; }
.script-item .title { text-align: center; color: #ccc; font-weight: 500; }

/* 2. 工作台布局 */
.workbench-view { display: flex; height: 100%; width: 100%; }

/* --- 左栏: 列表 --- */
.col-left { width: 200px; background: #1a1a1a; border-right: 1px solid #2a2a2a; display: flex; flex-direction: column; }
.panel-header { padding: 15px; border-bottom: 1px solid #2a2a2a; display: flex; flex-direction: column; }
.panel-header span { font-weight: bold; color: #fff; }
.panel-header small { color: #666; font-size: 11px; margin-top: 4px; }

.shot-list { flex: 1; overflow-y: auto; padding: 10px; }
.shot-card { 
  display: flex; align-items: center; gap: 10px; padding: 10px; 
  background: #252525; border-radius: 6px; margin-bottom: 8px; 
  cursor: pointer; border: 1px solid transparent; 
}
.shot-card:hover { border-color: #555; }
.shot-card.active { background: #2a2d3e; border-color: #409EFF; }
.shot-idx { font-family: monospace; color: #666; font-size: 11px; }
.shot-info { flex: 1; display: flex; flex-direction: column; }
.shot-info .name { font-size: 13px; color: #ddd; }
.shot-info .dur { font-size: 10px; color: #888; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-dot.blue { background: #409EFF; }
.status-dot.gray { background: #444; }

/* --- 中栏: 预览 (缩小) --- */
.col-center { flex: 1; background: #0f0f0f; display: flex; align-items: center; justify-content: center; padding: 20px; }
.preview-container { 
  width: 100%; max-width: 400px; 
  background: #000; border: 1px solid #333; border-radius: 8px; 
  display: flex; flex-direction: column; overflow: hidden;
}
.preview-header { padding: 8px 12px; background: #1a1a1a; display: flex; justify-content: space-between; font-size: 11px; color: #666; }
.canvas-box { aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; background: #050505; position: relative; padding: 20px; box-sizing: border-box; }
.empty-placeholder { text-align: center; color: #444; width: 100%; }
.empty-placeholder .icon { font-size: 32px; margin-bottom: 10px; }
.empty-placeholder .text { font-size: 14px; margin-bottom: 5px; }
.empty-placeholder .sub-text { font-size: 10px; color: #333; word-break: break-all; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

.simple-controls { padding: 10px; display: flex; align-items: center; gap: 10px; justify-content: center; border-top: 1px solid #222; }
.btn-icon { background: none; border: 1px solid #333; color: #888; border-radius: 4px; padding: 2px 8px; cursor: pointer; }
.time-code { font-family: monospace; font-size: 11px; color: #666; margin-left: 10px; }

/* --- 右栏: 配置 (核心) --- */
.col-right { width: 360px; background: #1a1a1a; border-left: 1px solid #2a2a2a; display: flex; flex-direction: column; }

/* 模式 Tab */
.mode-tabs { display: flex; border-bottom: 1px solid #2a2a2a; }
.mode-tabs button { 
  flex: 1; background: transparent; border: none; padding: 12px; color: #888; 
  cursor: pointer; border-bottom: 2px solid transparent; font-size: 13px;
}
.mode-tabs button.active { color: #fff; border-bottom-color: #409EFF; background: #202020; }

.config-scroller { flex: 1; overflow-y: auto; padding: 20px; }
.section-block { margin-bottom: 25px; }
.section-title { font-size: 12px; color: #888; margin-bottom: 10px; }

/* 资产槽位 */
.asset-slots { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
.slot-item { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; }
.slot-box { 
  width: 50px; height: 50px; border: 1px dashed #444; border-radius: 6px; 
  display: flex; align-items: center; justify-content: center; font-size: 18px; 
  background: #222; overflow: hidden;
}
.slot-box.filled { border-style: solid; border-color: #409EFF; }
.slot-box img { width: 100%; height: 100%; object-fit: cover; }
.slot-label { font-size: 10px; color: #666; }

/* 首尾帧 */
.keyframes-slots { display: flex; align-items: center; justify-content: space-between; }
.kf-upload { flex: 1; text-align: center; }
.upload-box { 
  height: 80px; border: 1px dashed #444; border-radius: 6px; background: #222; 
  display: flex; align-items: center; justify-content: center; color: #555; font-size: 11px; cursor: pointer;
}
.upload-box:hover { border-color: #409EFF; color: #409EFF; }
.arrow { color: #444; padding: 0 10px; }

/* 提示词构建器 */
.prompt-builder { display: flex; flex-direction: column; gap: 12px; }
.form-row label, .grid-item label { display: block; font-size: 10px; color: #666; margin-bottom: 4px; }

.dark-input { 
  background: #111; border: 1px solid #333; color: #ddd; padding: 8px; 
  border-radius: 4px; font-size: 12px; outline: none; box-sizing: border-box; width: 100%;
}
.dark-input.area { resize: vertical; line-height: 1.5; font-family: inherit; }
.dark-input.small { padding: 6px 8px; border-color: #409EFF; }
.dark-input:focus { border-color: #409EFF; }

.dark-select {
  background: #111; border: 1px solid #333; color: #ccc; padding: 6px; 
  border-radius: 4px; font-size: 11px; width: 100%; outline: none;
}
.dark-select:focus { border-color: #409EFF; }
.text-gray { color: #666; }
.text-blue { color: #409EFF; font-weight: bold; }

/* 自定义输入框交互 */
.input-wrap { display: flex; align-items: center; gap: 4px; }
.close-input { 
  background: #2a2a2a; border: 1px solid #333; color: #888; 
  width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 14px;
}
.close-input:hover { color: #F56C6C; border-color: #F56C6C; }

.param-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

/* 生成参数 */
.params-box { background: #202020; padding: 15px; border-radius: 6px; border: 1px solid #333; }
.param-row { margin-bottom: 12px; }
.param-row:last-child { margin-bottom: 0; }
.param-row label { display: block; font-size: 11px; color: #888; margin-bottom: 6px; }
.radio-group { display: flex; gap: 5px; flex-wrap: wrap; }
.radio-group button { 
  flex: 1; background: #2a2a2a; border: 1px solid #333; color: #ccc; 
  padding: 5px; border-radius: 4px; font-size: 11px; cursor: pointer; 
}
.radio-group button.active { background: #409EFF; color: white; border-color: #409EFF; }

.count-selector button {
  width: 30px; height: 30px; border-radius: 4px; background: #2a2a2a; 
  border: 1px solid #333; color: #ccc; cursor: pointer; margin-right: 5px;
}
.count-selector button.active { background: #409EFF; color: white; border-color: #409EFF; }

/* 底部按钮 */
.action-footer { padding: 20px; border-top: 1px solid #2a2a2a; }
.btn-generate { 
  width: 100%; background: linear-gradient(90deg, #409EFF, #36D1DC); 
  border: none; padding: 12px; border-radius: 6px; color: white; 
  font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; 
  transition: transform 0.1s;
}
.btn-generate:active { transform: scale(0.98); }

/* 资产选择弹窗 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999; display: flex; justify-content: center; align-items: center; }
.asset-modal { width: 600px; height: 400px; background: #1a1a1a; border-radius: 8px; border: 1px solid #333; display: flex; flex-direction: column; }
.modal-header { padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: #fff; font-size: 16px; }
.close-btn { background: none; border: none; color: #888; cursor: pointer; font-size: 20px; }
.modal-grid { flex: 1; padding: 20px; overflow-y: auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }

.asset-card { text-align: center; cursor: pointer; }
.card-img-box { width: 100%; aspect-ratio: 1; background: #000; border-radius: 6px; overflow: hidden; border: 1px solid #333; margin-bottom: 5px; }
.card-img-box img { width: 100%; height: 100%; object-fit: cover; }
.card-name { font-size: 12px; color: #ccc; }

/* 上传卡片样式 */
.upload-card .upload-area { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  background: #222; border: 1px dashed #555; position: relative;
}
.upload-card .upload-area:hover { border-color: #409EFF; color: #409EFF; }
.upload-card input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.upload-card .icon { font-size: 24px; margin-bottom: 5px; }
.upload-card .hint { font-size: 10px; color: #666; }
</style>