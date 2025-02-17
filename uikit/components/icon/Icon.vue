<template>
  <i
    class="p-icon icon"
    :class="[`${iconPack}-${name}`, colorByType]"
    aria-hidden="true"
  ></i>
</template>

<script>
export default {
  name: 'PIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    iconPack: {
      type: String,
      default: 'wb',
      validator(value) {
        return ['wb', 'md', 'pe'].indexOf(value) > -1
      },
    },
    type: {
      type: String,
      default: '',
    },
  },
  computed: {
    colorByType() {
      switch (this.type) {
        case 'primary':
          return 'blue-600'
        case 'success':
          return 'green-600'
        case 'info':
          return 'cyan-600'
        case 'warning':
          return 'orange-600'
        case 'danger':
          return 'red-600'
        default:
          return 'gray-200'
      }
    },
  },
}
</script>
