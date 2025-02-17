<template>
  <Component
    :class="classNames"
    :is="com"
    v-bind="$attrs"
    @v-on="$listeners"
    @click="handleClick"
  />
</template>

<script>
export default {
  name: 'PSvg',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
    stroke: {
      type: String,
      default: '',
    },
    fill: {
      type: String,
      default: '',
    },
  },
  computed: {
    com() {
      return require(`@/assets/img/${this.name}.svg`).default
    },
    classNames() {
      const classNames = { 'p-svg': true }
      if (this.stroke) classNames[`stroke-${this.stroke}`] = true
      if (this.fill) classNames[`fill-${this.fill}`] = true

      return classNames
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>
<style lang="scss">
.p-svg {
  &.stroke-black {
    * {
      stroke: #313232;
    }
  }

  &.stroke-gray {
    * {
      stroke: #cfd0d0;
    }
  }

  &.fill-black {
    * {
      fill: #313232;
    }
  }

  &.fill-gray {
    * {
      fill: #cfd0d0;
    }
  }
}
</style>
