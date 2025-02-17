<template>
  <transition name="p-alert-fade">
    <div :class="wrapperClasses" v-show="visible" role="alert">
      <p-icon class="p-alert__icon" :name="iconName" v-if="showIcon"> </p-icon>
      <div class="p-alert__content">
        <span
          class="p-alert__title"
          :class="[isBoldTitle]"
          v-if="title || $slots.title"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="p-alert__description" v-if="$slots.default && !description">
          <slot></slot>
        </p>
        <p class="p-alert__description" v-if="description && !$slots.default">
          {{ description }}
        </p>
        <i
          class="p-alert__closebtn"
          :class="{
            'is-customed': closeText !== '',
            'wb-close': closeText === '',
          }"
          v-show="closable"
          @click="close()"
        >
          {{ closeText }}
        </i>
      </div>
    </div>
  </transition>
</template>

<script>
import PIcon from '../icon/Icon'
const TYPE_CLASSES_MAP = {
  success: 'check',
  warning: 'alert',
  error: 'close',
  info: 'info',
}

export default {
  name: 'PAlert',
  components: {
    PIcon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeText: {
      type: String,
      default: '',
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function(value) {
        return ['light', 'dark'].indexOf(value) !== -1
      },
    },
  },

  data() {
    return {
      visible: true,
    }
  },

  methods: {
    close() {
      this.visible = false
      this.$emit('close')
    },
  },

  computed: {
    wrapperClasses() {
      return [
        `p-alert`,
        `p-alert--${this.type}`,
        `is-${this.effect}`,
        this.center ? 'is-center' : '',
      ]
    },
    typeClass() {
      return `p-alert--${this.type}`
    },

    iconName() {
      return TYPE_CLASSES_MAP[this.type]
    },

    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : ''
    },

    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : ''
    },
  },
}
</script>
