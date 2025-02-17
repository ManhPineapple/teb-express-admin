<template>
  <transition :name="animation">
    <div
      v-if="isActive"
      class="p-modal is-active"
      :class="[
        { 'is-full-screen': fullScreen },
        customClass,
        { 'is-full-height': fullHeight },
      ]"
    >
      <div class="p-modal-background" @click="cancelOutSide()"></div>
      <div
        class="p-animation-content"
        :class="[{ 'p-modal-content': !hasModalCard }, classSize, typeClass]"
        :style="customStyle"
      >
        <div class="modal-content">
          <component
            v-if="component"
            v-bind="props"
            v-on="events"
            :is="component"
          />
          <div v-else-if="content" v-html="content"></div>
          <template v-else>
            <div class="modal-header">
              <slot name="header">
                <h4 class="modal-title">{{ title }}</h4>
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click="cancel('x')"
                >
                  <span aria-hidden="true" :disabled="disableClose">
                    <p-svg name="x"></p-svg>
                  </span>
                </button>
              </slot>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <slot name="footer"> </slot>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { removeElement } from '../../utils/dom'
import config from '../../config'

export default {
  name: 'PModal',
  props: {
    active: Boolean,
    component: [Object, Function],
    content: String,
    programmatic: Boolean,
    props: Object,
    events: Object,
    size: {
      type: String,
      default: 'lg',
    },
    width: {
      type: [String, Number],
      default: '',
    },
    hasModalCard: Boolean,
    animation: {
      type: String,
      default: 'zoom-out',
    },
    disableClose: {
      type: Boolean,
      default: false,
    },
    closeOutside: {
      type: Boolean,
      default: false,
    },
    canCancel: {
      type: [Array, Boolean],
      default: () => {
        return config.defaultModalCanCancel
      },
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    scroll: {
      type: String,
      default: () => {
        return config.defaultModalScroll ? config.defaultModalScroll : 'clip'
      },
      validator: (value) => {
        return ['clip', 'keep'].indexOf(value) >= 0
      },
    },
    fullScreen: Boolean,
    fullHeight: Boolean,
    customClass: String,
    title: {
      type: String,
      default: '',
    },
    typeClass: String,
  },
  data() {
    return {
      isActive: this.active || false,
      savedScrollTop: null,
      newWidth: typeof this.width === 'number' ? this.width + 'px' : this.width,
    }
  },
  computed: {
    classSize() {
      return this.size ? 'modal-' + this.size : ''
    },
    cancelOptions() {
      return typeof this.canCancel === 'boolean'
        ? this.canCancel
          ? config.defaultModalCanCancel
          : []
        : this.canCancel
    },
    showX() {
      return this.cancelOptions.indexOf('x') >= 0
    },
    customStyle() {
      if (!this.fullScreen) {
        return { maxWidth: this.newWidth }
      }
      return null
    },
  },
  watch: {
    active(value) {
      this.isActive = value
    },
    isActive() {
      this.handleScroll()
    },
  },
  methods: {
    hasHeaderSlot() {
      return this.$slots.header || this.title
    },
    handleScroll() {
      if (typeof window === 'undefined') {
        return
      }

      if (this.scroll === 'clip') {
        if (this.isActive) {
          document.documentElement.classList.add('is-clipped')
        } else {
          document.documentElement.classList.remove('is-clipped')
        }
        return
      }

      this.savedScrollTop = !this.savedScrollTop
        ? document.documentElement.scrollTop
        : this.savedScrollTop

      if (this.isActive) {
        document.body.classList.add('is-noscroll')
      } else {
        document.body.classList.remove('is-noscroll')
      }

      if (this.isActive) {
        document.body.style.top = `-${this.savedScrollTop}px`
        return
      }

      document.documentElement.scrollTop = this.savedScrollTop
      document.body.style.top = null
      this.savedScrollTop = null
    },

    /**
     * Close the Modal if canCancel and call the onCancel prop (function).
     */
    cancel(method) {
      if (this.cancelOptions.indexOf(method) < 0) {
        return
      }
      this.onCancel.apply(null, arguments)
      this.close()
    },
    cancelOutSide() {
      if (this.closeOutside) {
        return
      }
      this.close()
    },

    /**
     * Call the onCancel prop (function).
     * Emit events, and destroy modal if it's programmatic.
     */
    close() {
      this.$emit('close')
      this.$emit('update:active', false)

      // Timeout for the animation complete before destroying
      if (this.programmatic) {
        this.isActive = false
        setTimeout(() => {
          this.$destroy()
          removeElement(this.$el)
        }, 150)
      }
    },

    /**
     * Keypress event that is bound to the document.
     */
    keyPress(event) {
      // Esc key
      if (this.isActive && event.keyCode === 27) {
        this.cancel('escape')
      }
    },
  },
  created() {
    if (typeof window !== 'undefined') {
      document.addEventListener('keyup', this.keyPress)
    }
  },
  beforeMount() {
    // Insert the Modal component in body tag
    // only if it's programmatic
    this.programmatic && document.body.appendChild(this.$el)
  },
  mounted() {
    if (this.programmatic) this.isActive = true
    else if (this.isActive) this.handleScroll()
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keyup', this.keyPress)
      // reset scroll
      document.documentElement.classList.remove('is-clipped')
      const savedScrollTop = !this.savedScrollTop
        ? document.documentElement.scrollTop
        : this.savedScrollTop
      document.body.classList.remove('is-noscroll')
      document.documentElement.scrollTop = savedScrollTop
      document.body.style.top = null
    }
  },
}
</script>
