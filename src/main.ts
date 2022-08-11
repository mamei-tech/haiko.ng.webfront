import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSidebarMenu from 'vue-sidebar-menu'

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSidebarMenu)

app.mount('#app')

