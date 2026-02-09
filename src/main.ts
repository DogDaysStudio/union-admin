import './assets/main.css'
import 'element-plus/dist/index.css'
import './assets/styles/element/override.scss'

import {createApp} from 'vue'
import {setGlobalOptions} from 'vue-request'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

setGlobalOptions({
  manual: true,
  // loadingDelay: 500,
  pagination: {
    currentKey: 'pageNum',
    pageSizeKey: 'pageSize',
    totalKey: 'total',
  },
})

const app = createApp(App)

app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')
