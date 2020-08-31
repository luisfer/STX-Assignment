import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './assets/styles.css'
import { makeServer } from "./server"

Vue.config.productionTip = false

if (process.env.NODE_ENV === "development") {
  makeServer()
}

Vue.use(Vuelidate)
Vue.use(Buefy)

new Vue({
  render: h => h(App),
}).$mount('#app')
