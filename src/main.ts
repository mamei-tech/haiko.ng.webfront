import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import VueSidebarMenu from 'vue-sidebar-menu'
import DirectivesCollection from './directives/DirectivesCollection'
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue'

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(DirectivesCollection)
app.use(Toast, { transition: "Vue-Toastification__fade", maxToasts: 6, newestOnTop: true })     // transition: Vue-Toastification__slideBlurred | transition: Vue-Toastification__bounce
app.use(router)
app.use(BootstrapIconsPlugin)
app.use(VueSidebarMenu)

app.mount('#app')
