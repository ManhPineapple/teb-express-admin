<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        class="p-popper"
        :class="wrapperClasses"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="width ? { width: width + 'px' } : { width: 'auto' }"
        role="tooltip"
        :id="tooltipId"
        :aria-hidden="disabled || !showPopper ? 'true' : 'false'"
      >
        <div class="p-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
        <slot name="custom-content"></slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>

<script>
import {
  generateId,
  domOff,
  domOn,
  addClass,
  removeClass,
} from '../../utils/dom'
import Popper from '../../mixins/Popper'

export default {
  name: 'PPopover',
  mixins: [Popper],
  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: (value) =>
        ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1,
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    title: String,
    disabled: Boolean,
    content: String,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 0,
    },
    transition: {
      type: String,
      default: 'fade-in-linear',
    },
    useCustomClass: {
      type: Boolean,
      default: false,
    },
    type: {
      default: '',
    },
    compact: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    wrapperClasses() {
      const classes = [
        this.popperClass,
        this.content && !this.compact ? 'p-popover--plain' : '',
        this.content && this.compact ? 'p-popover--compact' : '',
        this.type ? `is-${this.type}` : '',
      ]
      if (this.showPopper) {
        classes.push('popover-activated')
      }

      if (!this.useCustomClass) {
        classes.push('p-popover')
      }
      return classes
    },

    tooltipId() {
      return `p-popover-${generateId()}`
    },
  },
  mounted() {
    let reference = (this.referenceElm = this.reference || this.$refs.reference)
    const popper = this.popper || this.$refs.popper

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm
    }

    if (reference) {
      addClass(reference, 'p-popover__reference')
      reference.setAttribute('aria-describedby', this.tooltipId)
      reference.setAttribute('tabindex', 0) // tab序列
      popper.setAttribute('tabindex', 0)

      if (this.trigger !== 'click') {
        domOn(reference, 'focusin', () => {
          this.handleFocus()
          const instance = reference.__vue__
          if (instance && typeof instance.focus === 'function') {
            instance.focus()
          }
        })
        domOn(popper, 'focusin', this.handleFocus)
        domOn(reference, 'focusout', this.handleBlur)
        domOn(popper, 'focusout', this.handleBlur)
      }

      domOn(reference, 'keydown', this.handleKeydown)
      domOn(reference, 'click', this.handleClick)
    }
    if (this.trigger === 'click') {
      domOn(reference, 'click', this.doToggle)
      domOn(document, 'click', this.handleDocumentClick)
    } else if (this.trigger === 'hover') {
      domOn(reference, 'mouseenter', this.handleMouseEnter)
      domOn(popper, 'mouseenter', this.handleMouseEnter)
      domOn(reference, 'mouseleave', this.handleMouseLeave)
      domOn(popper, 'mouseleave', this.handleMouseLeave)
    } else if (this.trigger === 'focus') {
      if (reference.querySelector('input, textarea')) {
        domOn(reference, 'focusin', this.doShow)
        domOn(reference, 'focusout', this.doClose)
      } else {
        domOn(reference, 'mousedown', this.doShow)
        domOn(reference, 'mouseup', this.doClose)
      }
    }
  },
  methods: {
    doToggle() {
      this.showPopper = !this.showPopper
    },
    doShow() {
      this.showPopper = true
    },
    doClose() {
      this.showPopper = false
    },
    handleFocus() {
      addClass(this.referenceElm, 'focusing')
      if (this.trigger === 'click' || this.trigger === 'focus') {
        this.showPopper = true
      }
    },
    handleClick() {
      removeClass(this.referenceElm, 'focusing')
    },
    handleBlur() {
      removeClass(this.referenceElm, 'focusing')
      if (this.trigger === 'click' || this.trigger === 'focus')
        this.showPopper = false
    },
    handleMouseEnter() {
      clearTimeout(this._timer)
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = true
        }, this.openDelay)
      } else {
        this.showPopper = true
      }
    },
    handleKeydown(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') {
        this.doClose()
      }
    },
    handleMouseLeave() {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.showPopper = false
      }, 200)
    },
    handleDocumentClick(e) {
      let reference = this.reference || this.$refs.reference
      const popper = this.popper || this.$refs.popper

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm
      }

      if (
        !this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)
      ) {
        return
      }

      this.showPopper = false
    },
    handleAfterEnter() {
      this.$emit('after-enter')
    },
    handleAfterLeave() {
      this.$emit('after-leave')
      this.doDestroy()
    },
    cleanup() {
      if (this.openDelay) {
        clearTimeout(this._timer)
      }
    },
  },
  watch: {
    showPopper(val) {
      if (this.disabled) {
        return
      }

      val ? this.$emit('show') : this.$emit('hide')
    },
  },

  beforeDestroy() {
    this.cleanup()
  },

  deactivated() {
    this.cleanup()
  },

  destroyed() {
    const reference = this.reference

    domOff(reference, 'click', this.doToggle)
    domOff(reference, 'mouseup', this.doClose)
    domOff(reference, 'mousedown', this.doShow)
    domOff(reference, 'focusin', this.doShow)
    domOff(reference, 'focusout', this.doClose)
    domOff(reference, 'mousedown', this.doShow)
    domOff(reference, 'mouseup', this.doClose)
    domOff(reference, 'mouseleave', this.handleMouseLeave)
    domOff(reference, 'mouseenter', this.handleMouseEnter)
    domOff(document, 'click', this.handleDocumentClick)
  },
}
</script>
