

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入我们刚才写的路由文件

const app = createApp(App)

app.use(router) // 关键：告诉 App 使用路由
app.mount('#app')