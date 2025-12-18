<script setup>
import { ref, computed, reactive } from 'vue'

// ==========================================
// 1. 数据状态管理
// ==========================================

const currentCategory = ref('all') // all | roles | scenes | props

// 模拟资产数据
const assets = ref([
  { 
    id: 101, type: 'roles', name: "顾清寒", 
    thumb: "https://via.placeholder.com/300/34495E/FFF?text=Gu+Qinghan", 
    createTime: "2025-03-10 14:30", isActor: true,
    prompt: "High quality portrait of a cold CEO, wearing black suit, sharp eyes, cinematic lighting, 8k..."
  },
  { 
    id: 102, type: 'roles', name: "苏浅浅", 
    thumb: "https://via.placeholder.com/300/E74C3C/FFF?text=Su+Qianqian", 
    createTime: "2025-03-11 09:15", isActor: true,
    prompt: "Young energetic girl, holding coffee, smiling, casual daily wear, soft natural light..."
  },
  { 
    id: 201, type: 'scenes', name: "赛博雨夜街道", 
    thumb: "https://via.placeholder.com/300/111/FFF?text=Cyber+City", 
    createTime: "2025-03-12 20:00", isActor: false,
    prompt: "Cyberpunk city street at night, raining, neon lights reflection, wet ground, futuristic buildings..."
  },
  { 
    id: 202, type: 'scenes', name: "豪华办公室", 
    thumb: "https://via.placeholder.com/300/555/FFF?text=Luxury+Office", 
    createTime: "2025-03-13 10:00", isActor: false,
    prompt: "Modern luxury office interior, floor to ceiling windows, city skyline view, marble floor..."
  },
  { 
    id: 301, type: 'props', name: "机密文件", 
    thumb: "https://via.placeholder.com/300/888/333?text=Top+Secret", 
    createTime: "2025-03-14 16:45", isActor: false,
    prompt: "Top secret folder, stamped 'CONFIDENTIAL', laying on wooden desk, close up shot..."
  }
])

const filteredAssets = computed(() => {
  if (currentCategory.value === 'all') return assets.value
  return assets.value.filter(item => item.type === currentCategory.value)
})

// ==========================================
// 2. 弹窗逻辑
// ==========================================

const showDetailModal = ref(false)
const showRemixModal = ref(false)
const currentAsset = ref(null)

const remixForm = reactive({
  newName: '',
  model: 'Stable Diffusion XL',
  prompt: '',
  strength: 0.7,
  batchSize: 1
})

const openDetail = (asset) => {
  currentAsset.value = asset
  showDetailModal.value = true
}

const openRemix = () => {
  if (!currentAsset.value) return
  remixForm.newName = `${currentAsset.value.name}_Remix`
  remixForm.prompt = currentAsset.value.prompt
  remixForm.strength = 0.7
  remixForm.batchSize = 1
  showRemixModal.value = true
}

const submitRemixTask = () => {
  alert(`✅ 任务已提交！\n生成 [${remixForm.batchSize}] 张\n模型: ${remixForm.model}`)
  showRemixModal.value = false
  showDetailModal.value = false
}

const deleteAsset = () => {
  if(confirm('确定要删除这个资产吗？')) {
    const idx = assets.value.findIndex(a => a.id === currentAsset.value.id)
    if (idx !== -1) assets.value.splice(idx, 1)
    showDetailModal.value = false
  }
}

</script>

<template>
  <div class="asset-page">
    <aside class="category-sidebar">
      <div class="sidebar-header">资产分类</div>
      <ul class="category-list">
        <li :class="{active: currentCategory === 'all'}" @click="currentCategory = 'all'">
          <span class="icon">📁</span> 全部资产
        </li>
        <li :class="{active: currentCategory === 'roles'}" @click="currentCategory = 'roles'">
          <span class="icon">👤</span> 角色库
        </li>
        <li :class="{active: currentCategory === 'scenes'}" @click="currentCategory = 'scenes'">
          <span class="icon">🏙️</span> 场景风格
        </li>
        <li :class="{active: currentCategory === 'props'}" @click="currentCategory = 'props'">
          <span class="icon">📦</span> 道具物品
        </li>
      </ul>
    </aside>

    <main class="asset-content">
      <div class="content-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="搜索资产名称..." />
        </div>
        <button class="btn-primary-gradient">☁️ 上传新资产</button>
      </div>

      <div class="asset-grid">
        <div v-for="item in filteredAssets" :key="item.id" class="asset-card" @click="openDetail(item)">
          <div class="card-thumb">
            <img :src="item.thumb" loading="lazy" />
            <div class="card-hover-mask">
              <span>点击查看详情</span>
            </div>
            <div class="type-tag">{{ item.type === 'roles' ? '角色' : item.type === 'scenes' ? '场景' : '道具' }}</div>
          </div>
          <div class="card-info">
            <div class="asset-name">{{ item.name }}</div>
            <div class="asset-date">{{ item.createTime.split(' ')[0] }}</div>
          </div>
        </div>
        
        <div class="upload-placeholder">
          <div class="dashed-box">
            <span class="plus-icon">＋</span>
            <span class="text">拖拽文件至此上传</span>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-box detail-modal">
        <button class="close-btn" @click="showDetailModal = false">×</button>
        <div class="detail-layout">
          <div class="detail-left">
            <div class="preview-box">
              <img :src="currentAsset.thumb" />
            </div>
          </div>
          <div class="detail-right">
            <div class="info-header">
              <h3>{{ currentAsset.name }}</h3>
              <span class="id-tag">ID: {{ currentAsset.id }}</span>
            </div>
            <div class="info-row">
              <label>资产类型</label><span class="val">{{ currentAsset.type }}</span>
            </div>
            <div class="info-row">
              <label>创建时间</label><span class="val">{{ currentAsset.createTime }}</span>
            </div>
            <div class="info-row">
              <label>是否参演</label>
              <span class="status-tag" :class="{active: currentAsset.isActor}">{{ currentAsset.isActor ? '出演中' : '未分配' }}</span>
            </div>
            <div class="prompt-box">
              <label>生成提示词 (Prompt)</label>
              <div class="prompt-content">{{ currentAsset.prompt }}</div>
            </div>
            <div class="detail-footer">
              <button class="btn-text-danger" @click="deleteAsset">🗑️ 删除资产</button>
              <button class="btn-primary-lg" @click="openRemix">✨ 二次创作</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRemixModal" class="modal-overlay" style="z-index: 1100;" @click.self="showRemixModal = false">
      <div class="modal-box remix-modal">
        <div class="modal-head">
          <h3>✨ 资产二次创作</h3>
          <p>基于当前资产生成新的变体</p>
        </div>
        <div class="form-body">
          <div class="form-item">
            <label>新资产名称</label>
            <input type="text" v-model="remixForm.newName" class="dark-input" />
          </div>
          <div class="form-item">
            <label>AI 模型</label>
            <select v-model="remixForm.model" class="dark-input">
              <option>Stable Diffusion XL</option>
              <option>Midjourney V6 (API)</option>
              <option>DALL·E 3</option>
            </select>
          </div>
          <div class="form-item">
            <label>提示词 (Prompt)</label>
            <textarea v-model="remixForm.prompt" class="dark-input area" rows="4"></textarea>
          </div>
          <div class="form-item">
            <div class="slider-header"><label>重绘幅度</label><span class="val">{{ remixForm.strength }}</span></div>
            <input type="range" v-model.number="remixForm.strength" min="0.1" max="1.0" step="0.05" class="range-input" />
          </div>
          <div class="form-item">
            <label>生成数量</label>
            <div class="radio-group">
              <button v-for="n in 5" :key="n" :class="{active: remixForm.batchSize === n}" @click="remixForm.batchSize = n">{{ n }}</button>
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn-secondary" @click="showRemixModal = false">取消</button>
          <button class="btn-primary" @click="submitRemixTask">提交任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局布局 */
.asset-page { height: 100%; background-color: #0f0f0f; color: #E0E0E0; display: flex; font-family: 'Segoe UI', sans-serif; overflow: hidden; }

/* 侧边栏 */
.category-sidebar { width: 220px; background-color: #1a1a1a; border-right: 1px solid #2a2a2a; display: flex; flex-direction: column; padding: 20px 0; flex-shrink: 0; }
.sidebar-header { padding: 0 20px 15px; font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.category-list { list-style: none; padding: 0; margin: 0; }
.category-list li { padding: 12px 20px; cursor: pointer; color: #aaa; font-size: 14px; display: flex; align-items: center; border-left: 3px solid transparent; }
.category-list li:hover { background-color: #252525; color: #fff; }
.category-list li.active { background-color: #2a2d3e; color: #409EFF; border-left-color: #409EFF; font-weight: 500; }
.category-list li .icon { margin-right: 10px; font-size: 16px; width: 20px; text-align: center; }

/* 内容区 */
.asset-content { flex: 1; display: flex; flex-direction: column; padding: 20px 30px; overflow: hidden; background-color: #0f0f0f; }
.content-toolbar { height: 50px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0; }
.search-box { display: flex; align-items: center; background: #1a1a1a; border: 1px solid #333; padding: 8px 12px; border-radius: 6px; width: 300px; }
.search-box input { background: transparent; border: none; color: #fff; margin-left: 8px; outline: none; flex: 1; font-size: 14px; }
.search-icon { color: #666; }
.btn-primary-gradient { background: linear-gradient(135deg, #409EFF 0%, #3a8ee6 100%); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; white-space: nowrap; }

/* 网格与卡片 */
.asset-grid { flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); grid-auto-rows: max-content; gap: 20px; padding-bottom: 40px; padding-right: 5px; }
.asset-card { background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid #2a2a2a; cursor: pointer; transition: all 0.3s; position: relative; }
.asset-card:hover { transform: translateY(-4px); border-color: #409EFF; }
.card-thumb { width: 100%; aspect-ratio: 1 / 1; background: #000; position: relative; overflow: hidden; }
.card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
.asset-card:hover .card-thumb img { transform: scale(1.1); }
.card-hover-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; font-size: 13px; font-weight: bold; color: #fff; backdrop-filter: blur(2px); }
.asset-card:hover .card-hover-mask { opacity: 1; }
.type-tag { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 3px 6px; border-radius: 4px; backdrop-filter: blur(4px); z-index: 2; border: 1px solid rgba(255,255,255,0.1); }
.card-info { padding: 12px; border-top: 1px solid #2a2a2a; background: #1a1a1a; z-index: 5; position: relative; }
.asset-name { font-weight: 600; font-size: 14px; color: #eee; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.asset-date { font-size: 12px; color: #666; }
.upload-placeholder { border: 2px dashed #333; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1 / 1; cursor: pointer; transition: 0.2s; background: rgba(255,255,255,0.02); color: #666; }
.upload-placeholder:hover { border-color: #409EFF; background: rgba(64, 158, 255, 0.05); color: #409EFF; }
.plus-icon { font-size: 24px; margin-bottom: 8px; }

/* 弹窗样式 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
.modal-box { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); position: relative; overflow: hidden; }
.close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; color: #666; cursor: pointer; z-index: 10; }
.close-btn:hover { color: #fff; }
.detail-modal { width: 800px; height: 500px; display: flex; }
.detail-layout { display: flex; width: 100%; height: 100%; }
.detail-left { width: 45%; background: #000; display: flex; align-items: center; justify-content: center; border-right: 1px solid #2a2a2a; }
.preview-box { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #050505; }
.preview-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
.detail-right { flex: 1; padding: 30px; display: flex; flex-direction: column; background: #1a1a1a; }
.info-header { margin-bottom: 20px; border-bottom: 1px solid #2a2a2a; padding-bottom: 15px; }
.info-header h3 { margin: 0 0 5px 0; font-size: 20px; color: #fff; }
.id-tag { font-family: 'Consolas', monospace; color: #555; font-size: 12px; background: #222; padding: 2px 6px; border-radius: 4px; }
.info-row { display: flex; margin-bottom: 12px; font-size: 13px; align-items: center; }
.info-row label { width: 80px; color: #888; }
.info-row .val { color: #ddd; }
.status-tag { padding: 2px 8px; border-radius: 4px; font-size: 11px; background: #333; color: #aaa; }
.status-tag.active { background: rgba(103, 194, 58, 0.1); color: #67C23A; border: 1px solid rgba(103, 194, 58, 0.2); }
.prompt-box { margin-top: 10px; flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.prompt-box label { color: #888; font-size: 13px; margin-bottom: 8px; display: block; }
.prompt-content { background: #111; padding: 12px; border-radius: 6px; border: 1px solid #333; color: #ccc; font-size: 13px; line-height: 1.6; flex: 1; overflow-y: auto; font-family: 'Consolas', sans-serif; }
.detail-footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
.btn-text-danger { background: none; border: none; color: #666; cursor: pointer; font-size: 13px; transition: 0.2s; }
.btn-text-danger:hover { color: #F56C6C; }
.btn-primary-lg { background: #409EFF; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: 0.2s; }
.remix-modal { width: 500px; padding: 25px; background: #1a1a1a; }
.modal-head { margin-bottom: 20px; text-align: center; }
.modal-head h3 { margin: 0; color: #fff; }
.modal-head p { margin: 5px 0 0; color: #666; font-size: 12px; }
.form-body { display: flex; flex-direction: column; gap: 15px; }
.form-item label { display: block; color: #aaa; font-size: 13px; margin-bottom: 6px; }
.dark-input { width: 100%; background: #111; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 6px; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.dark-input:focus { border-color: #409EFF; }
.dark-input.area { resize: vertical; line-height: 1.5; font-family: inherit; }
.slider-header { display: flex; justify-content: space-between; color: #888; font-size: 12px; }
.range-input { width: 100%; accent-color: #409EFF; cursor: pointer; }
.radio-group { display: flex; gap: 10px; }
.radio-group button { flex: 1; background: #252525; border: 1px solid #333; color: #ccc; padding: 8px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.radio-group button:hover { background: #333; }
.radio-group button.active { background: #409EFF; color: white; border-color: #409EFF; }
.modal-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
.btn-secondary { background: transparent; border: 1px solid #444; color: #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.btn-secondary:hover { border-color: #666; color: #fff; }
.btn-primary { background: #409EFF; border: none; color: white; padding: 8px 20px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.btn-primary:hover { background: #66b1ff; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #555; }
</style>