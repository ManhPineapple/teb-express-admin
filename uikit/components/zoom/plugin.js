import Vue from 'vue'
import Zoom from './zoom'

import { use, registerComponentProgrammatic } from '../../utils/plugin'

const ZoomImageProgrammatic = {
  open(url, alt = '') {
    const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue
    const ImageComponent = vm.extend(Zoom)

    const propsData = { url, alt }

    return new ImageComponent({
      el: document.createElement('div'),
      propsData,
    })
  },
}

const Plugin = {
  install(Vue) {
    registerComponentProgrammatic(Vue, '$zoom', ZoomImageProgrammatic)
  },
}

use(Vue, Plugin)

export default Plugin

export { ZoomImageProgrammatic }
