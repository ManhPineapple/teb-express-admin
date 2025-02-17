import Vue from 'vue'
import Toast from './Toast'

import config from '../../config'
import { use, registerComponentProgrammatic } from '../../utils/plugin'

const ToastProgrammatic = {
  open(params) {
    let message
    let parent

    if (typeof params === 'string') {
      message = params
    }

    const defaultParam = {
      message,
      position: config.defaultToastPosition || 'top',
    }

    if (params.parent) {
      parent = params.parent
      delete params.parent
    }

    const propsData = Object.assign(defaultParam, params)

    const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue
    const ToastComponent = vm.extend(Toast)

    return new ToastComponent({
      parent,
      el: document.createElement('div'),
      propsData,
    })
  },
  error(message, options = {}) {
    this.open({ ...options, type: 'error', message })
  },
  success(message, options = {}) {
    this.open({ ...options, type: 'success', message })
  },
  warning(message, options = {}) {
    this.open({ ...options, type: 'warning', message })
  },
}

const Plugin = {
  install(Vue) {
    registerComponentProgrammatic(Vue, '$toast', ToastProgrammatic)
  },
}

use(Vue, Plugin)

export default Plugin

export { ToastProgrammatic }
