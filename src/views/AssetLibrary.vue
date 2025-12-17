<script setup>
import { ref } from 'vue'

const activeTab = ref('characters')
const assets = ref([
  { id: 1, name: '男主-顾满神', type: 'character', img: 'https://via.placeholder.com/150' },
  { id: 2, name: '女主-苏浅浅', type: 'character', img: 'https://via.placeholder.com/150' },
  { id: 3, name: '道具-古董表', type: 'prop', img: 'https://via.placeholder.com/150' }
])
</script>

<template>
  <div class="assets-page">
    <h2>🗂️ 团队资产库</h2>
    
    <div class="tabs">
      <button :class="{ active: activeTab === 'characters' }" @click="activeTab = 'characters'">👤 角色 (一致性)</button>
      <button :class="{ active: activeTab === 'props' }" @click="activeTab = 'props'">💍 道具物品</button>
      <button :class="{ active: activeTab === 'scenes' }" @click="activeTab = 'scenes'">🏙️ 场景风格</button>
    </div>

    <div class="asset-grid">
      <div class="upload-card">
        <span>+ 上传新素材</span>
      </div>
      <div v-for="item in assets" :key="item.id" class="asset-card">
        <img :src="item.img" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assets-page { padding: 20px; }
.tabs { margin-bottom: 20px; border-bottom: 1px solid #ddd; }
.tabs button { padding: 10px 20px; border: none; background: none; cursor: pointer; font-size: 16px; }
.tabs button.active { border-bottom: 3px solid #42b883; color: #42b883; font-weight: bold; }
.asset-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
.asset-card, .upload-card { background: white; border-radius: 8px; overflow: hidden; text-align: center; padding-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.upload-card { display: flex; align-items: center; justify-content: center; height: 200px; border: 2px dashed #ddd; color: #999; cursor: pointer; }
.asset-card img { width: 100%; height: 150px; object-fit: cover; }
</style>