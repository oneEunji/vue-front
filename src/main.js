/* main.js */
import './assets/common.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './vuex/store'  //1. store 추가
const app = createApp(App)
app.config.globalProperties.$axios = axios  //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
app.config.globalProperties.$serverUrl = process.env.VUE_APP_API_BASE_URL; //api server

app.config.globalProperties.$store = store
app
  .use(router)
  .use(store)   //2. store 등록
  .mount('#app')


  