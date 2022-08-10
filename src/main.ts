import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSidebarMenu from 'vue-sidebar-menu'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSidebarMenu)

app.mount('#app')


// mira a ver que puedes ir pasando para acá desde el proyecto viejo, mira los personalizaciones al css de las bibliotecas
// y revisa la inclusion de otros plugins como el navbar
