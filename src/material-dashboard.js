import VueMaterial from 'vue-material'
import SideBar from '@/plugins/layouts/default/sidebar'

export default {
  install(Vue) {
    Vue.use(VueMaterial)
    Vue.use(SideBar)
  },
}
