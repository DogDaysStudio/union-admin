import './assets/main.css'
import 'element-plus/dist/index.css'

import {createApp} from 'vue'
import {setGlobalOptions} from 'vue-request'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

setGlobalOptions({
  manual: true,
  // loadingDelay: 500,
  // pagination: {
  //   currentKey: 'pageNum',
  //   pageSizeKey: 'pageSize',
  //   totalKey: 'data.total',
  // },
})

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
