import { ACL } from '@core/constants'
import { clickoutside } from '@core/vue/directives'

const MainPlugin = {
  install(Vue) {
    Vue.prototype.$isLogin = function () {
      return Boolean(this.$store.getters['auth/currentRole'])
    }
    Vue.prototype.$isAdmin = function () {
      return this.$store.getters['auth/isAdmin']
    }
    Vue.prototype.$isSupport = function () {
      return this.$store.getters['auth/isSupport']
    }
    Vue.prototype.$isSupportLeader = function () {
      return this.$store.getters['auth/isSupportLeader']
    }
    Vue.prototype.$isAccountant = function () {
      return this.$store.getters['auth/isAccountant']
    }
    Vue.prototype.$isWarehouse = function () {
      return this.$store.getters['auth/isWarehouse']
    }
    Vue.prototype.$isHub = function () {
      return this.$store.getters['auth/isHub']
    }
    Vue.prototype.$isBusinessManager = function () {
      return this.$store.getters['auth/isBusinessManager']
    }
    Vue.prototype.$isShipPartner = function () {
      return this.$store.getters['auth/isShipPartner']
    }
    Vue.prototype.$hasAuthorize = function (key) {
      if (typeof ACL[key] === 'undefined') {
        return false
      }

      const role = this.$store.getters['auth/currentRole']
      return ACL[key].indexOf(role) !== -1
    }

    Vue.prototype.$isMarketing = function () {
      return this.$store.getters['auth/isMarketing']
    }

    Vue.prototype.$isSale = function () {
      return this.$store.getters['auth/isSale']
    }

    Vue.prototype.$isSaleOperation = function () {
      return this.$store.getters['auth/isSaleOperation']
    }

    Vue.directive('click-outside', clickoutside)
  },
}

export default MainPlugin
