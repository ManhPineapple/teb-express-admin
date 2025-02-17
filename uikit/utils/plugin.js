export const use = (Vue, plugin) => {
  Vue.use(plugin)
}

export const registerComponent = (Vue, component) => {
  Vue.component(component.name, component)
}

export const registerComponentProgrammatic = (Vue, property, component) => {
  Vue.prototype[property] = component
}
