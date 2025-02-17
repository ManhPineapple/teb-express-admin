import Vue from 'vue'
import Confirm from './Confirm'

import { use, registerComponentProgrammatic } from '../../utils/plugin'

function open(propsData) {
  const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue
  const ConfirmComponent = vm.extend(Confirm)
  return new ConfirmComponent({
    el: document.createElement('div'),
    propsData,
  })
}

const ConfirmProgrammatic = (params) => {
  const defaultParam = {}
  const propsData = Object.assign(defaultParam, params)
  return open(propsData)
}

const Plugin = {
  install(Vue) {
    registerComponentProgrammatic(Vue, '$confirm', ConfirmProgrammatic)
  },
}

use(Vue, Plugin)

export default Plugin

export { ConfirmProgrammatic }
