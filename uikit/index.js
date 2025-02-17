import Vue from 'vue'
import './styles/pkit.scss'

const importAll = (context) => context.keys().forEach(context)

// Register plugins
const requirePlugin = require.context('./components', true, /plugin.js$/)
importAll(requirePlugin)

// Register components
const requireComponent = require.context('./components', true, /[\w]+\.vue$/)

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name

  if (componentName) {
    Vue.component(componentName, componentConfig.default || componentConfig)
  }
})
