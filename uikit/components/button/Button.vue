<template>
  <button
    :class="wrapperClasses"
    @click="handleClick"
    :disabled="disabled"
    :loading="loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <p-icon :name="icon" :iconPack="iconPack" v-if="icon && !loading"></p-icon>
    <template v-if="$slots.default">
      <slot></slot>
    </template>
  </button>
</template>

<script>
import PIcon from '../icon/Icon'
export default {
  name: 'PButton',
  components: {
    PIcon,
  },
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'lg', 'sm', 'xs'].indexOf(value) > -1
      },
    },
    icon: {
      type: String,
      default: '',
    },
    nativeType: {
      type: String,
      default: 'button',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    squared: {
      type: Boolean,
      default: false,
    },
    floating: {
      type: Boolean,
      default: false,
    },
    raised: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'top', 'bottom', 'left', 'right'].indexOf(value) > -1
      },
    },
    iconPack: {
      type: String,
      default: 'wb',
    },
  },
  computed: {
    wrapperClasses() {
      return [
        'p-button',
        'btn',
        this.type ? `btn-${this.type}` : '',
        this.direction ? `btn-${this.direction}` : '',
        this.size ? `btn-${this.size}` : '',
        {
          'btn-loading': this.loading,
          'btn-block': this.fullWidth,
          'btn-outline': this.outline,
          'btn-round': this.round,
          'btn-squared': this.squared,
          'btn-floating': this.floating,
          'btn-raised': this.raised,
          'btn-flat': this.flat,
          'btn-icon': !this.$slots.default && this.icon,
        },
      ]
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>
