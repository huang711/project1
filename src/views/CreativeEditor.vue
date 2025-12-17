<script setup>
import { ref } from 'vue'

// 模拟剧本数据
const scriptText = ref("场景：豪华办公室\n人物：顾满神（男，28岁），苏浅浅（女，22岁）\n\n[镜头1]\n顾满神坐在老板椅上，眉头紧锁。\n苏浅浅推门而入，手里端着咖啡。")

// 模拟生成的分镜列表 (对应表格中的“场景分镜脚本生成模块”)
const shots = ref([
  { id: 1, desc: "顾满神坐在老板椅上，眉头紧锁", prompt: "Handsome CEO sitting in luxury office, frowning, cinematic lighting...", type: "中景" },
  { id: 2, desc: "苏浅浅推门而入", prompt: "Young woman opening door, holding coffee, office background...", type: "全景" }
])

// 模拟 AI 拆解功能
const analyzeScript = () => {
  alert('正在调用 AI 拆解剧本...\n(功能对应：文本剧本拆解模块)')
}

// 模拟 提示词优化 功能
const optimizePrompt = (shot) => {
  shot.prompt += " (High Quality, 8k, detailed face)"
  alert('提示词已优化：增加细节描述\n(功能对应：语法结构优化模块)')
}
</script>

<template>
  <div class="editor-container">
    <div class="panel script-panel">
      <div class="panel-header">
        <h3>📝 剧本输入</h3>
        <button @click="analyzeScript" class="btn-primary">AI 一键拆解</button>
      </div>
      <textarea v-model="scriptText" placeholder="在此粘贴剧本..."></textarea>
    </div>

    <div class="panel storyboard-panel">
      <div class="panel-header">
        <h3>🎬 分镜工作台</h3>
        <span>共 {{ shots.length }} 个镜头</span>
      </div>
      <div class="shots-list">
        <div v-for="shot in shots" :key="shot.id" class="shot-card">
          <div class="shot-header">
            <span class="shot-id">#{{ shot.id }}</span>
            <select v-model="shot.type">
              <option>特写</option>
              <option>中景</option>
              <option>全景</option>
            </select>
          </div>
          <p class="shot-desc">{{ shot.desc }}</p>
          <div class="prompt-box">
            <small>AI 提示词:</small>
            <textarea v-model="shot.prompt"></textarea>
            <button @click="optimizePrompt(shot)" class="btn-sm">✨ 优化提示词</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel control-panel">
      <h3>⚙️ 生成参数</h3>
      <div class="control-group">
        <label>风格模型 (LoRA)</label>
        <select><option>都市写实</option><option>赛博朋克</option></select>
      </div>
      <div class="control-group">
        <label>角色一致性 (FaceID)</label>
        <div class="face-upload">[上传参考图]</div>
      </div>
      <button class="btn-primary full-width">生成视频片段</button>
    </div>
  </div>
</template>

<style scoped>
.editor-container { display: flex; gap: 20px; height: 100%; }
.panel { background: white; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; }
.script-panel { flex: 1; }
.storyboard-panel { flex: 2; background: #eef0f5; }
.control-panel { width: 280px; }
textarea { width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px; resize: none; }
.btn-primary { background: #42b883; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.btn-sm { background: #6366f1; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-top: 5px; cursor: pointer; }
.shot-card { background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.shot-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.prompt-box textarea { height: 60px; font-size: 12px; color: #666; margin-top: 5px; }
.control-group { margin-bottom: 15px; }
.full-width { width: 100%; margin-top: auto; }
</style>