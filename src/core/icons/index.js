import Vue from 'vue'

const icons = {}

const requireComponent = require.context('../../assets/icons/', true, /.svg$/)

requireComponent.keys().forEach((fileName) => {
  const iconName = fileName.replace(/^\.\/(.+)\.svg$/, '$1')
  const componentConfig = requireComponent(fileName)
  icons[iconName] = componentConfig.default || componentConfig
})

Vue.component('svgicon', {
  props: {
    name: {
      type: String,
      required: true,
      validator(value) {
        return Object.prototype.hasOwnProperty.call(icons, value)
      },
    },
  },
  computed: {
    iconComponent() {
      return icons[this.name]
    },
  },
  render: function(h) {
    return h(this.iconComponent, { class: `icon svg-${this.name}` })
  },
})
