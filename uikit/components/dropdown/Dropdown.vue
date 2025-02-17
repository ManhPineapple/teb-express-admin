<template>
  <div :class="wrapperClasses">
    <div
      v-if="!inline"
      role="button"
      ref="trigger"
      class="p-dropdown-trigger"
      @click="toggle"
      aria-haspopup="true"
    >
      <slot name="trigger" />
    </div>

    <transition :name="animation">
      <div
        v-if="isMobileModal"
        v-show="isActive"
        class="p-dropdown-background"
        :aria-hidden="!isActive"
      >
      </div>
    </transition>
    <transition :name="animation">
      <div
        v-show="(!disabled && (isActive || isHoverable)) || inline"
        ref="dropdownMenu"
        class="dropdown-menu"
        :class="dropdownClass"
        :aria-hidden="!isActive"
      >
        <div class="dropdown-content" :role="ariaRoleMenu">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PDropdown',
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Symbol, Function],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      validator(value) {
        return ['top-right', 'top-left', 'bottom-left'].indexOf(value) > -1
      },
    },
    mobileModal: {
      type: Boolean,
      default: true,
    },
    ariaRole: {
      type: String,
      default: '',
    },
    animation: {
      type: String,
      default: 'fade',
    },
    multiple: Boolean,
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    dropdownClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: this.value,
      isActive: false,
      isHoverable: this.hoverable,
      isDropdown: true, // Used internally by DropdownItem
    }
  },
  computed: {
    wrapperClasses() {
      return [
        'p-dropdown',
        this.position ? `is-${this.position}` : '',
        {
          'is-disabled': this.disabled,
          'is-hoverable': this.hoverable,
          'is-inline': this.inline,
          'is-active': this.isActive || this.inline,
          'is-mobile-modal': this.isMobileModal,
        },
      ]
    },
    isMobileModal() {
      return this.mobileModal && !this.inline && !this.hoverable
    },
    ariaRoleMenu() {
      return this.ariaRole === 'menu' || this.ariaRole === 'list'
        ? this.ariaRole
        : null
    },
  },
  watch: {
    /**
     * When v-model is changed set the _new selected item.
     */
    value(value) {
      this.selected = value
    },

    /**
     * Emit event when isActive value is changed.
     */
    isActive(value) {
      this.$emit('active-change', value)
    },
  },
  methods: {
    /**
     * Click listener from DropdownItem.
     *   1. Set _new selected item.
     *   2. Emit input event to update the user v-model.
     *   3. Close the dropdown.
     */
    selectItem(value) {
      if (this.multiple) {
        if (this.selected) {
          const index = this.selected.indexOf(value)
          if (index === -1) {
            this.selected.push(value)
          } else {
            this.selected.splice(index, 1)
          }
        } else {
          this.selected = [value]
        }
        this.$emit('change', this.selected)
      } else {
        if (this.selected !== value) {
          this.selected = value
          this.$emit('change', this.selected)
        }
      }

      this.$emit('input', this.selected)
      if (!this.multiple) {
        this.isActive = !this.closeOnClick
      }
    },

    /**
     * White-listed items to not close when clicked.
     */
    isInWhiteList(el) {
      if (el === this.$refs.dropdownMenu) {
        return true
      }

      if (el === this.$refs.trigger) {
        return true
      }

      // All chidren from dropdown
      if (this.$refs.dropdownMenu !== undefined) {
        const children = this.$refs.dropdownMenu.querySelectorAll('*')
        for (const child of children) {
          if (el === child) {
            return true
          }
        }
      }

      // All children from trigger
      if (this.$refs.trigger !== undefined) {
        const children = this.$refs.trigger.querySelectorAll('*')
        for (const child of children) {
          if (el === child) {
            return true
          }
        }
      }

      return false
    },

    /**
     * Close dropdown if clicked outside.
     */
    clickedOutside(event) {
      if (this.inline) {
        return
      }

      if (!this.isInWhiteList(event.target)) {
        this.isActive = false
      }
    },

    /**
     * Toggle dropdown if it's not disabled.
     */
    toggle() {
      if (this.disabled) {
        return
      }

      if (!this.isActive) {
        // if not active, toggle after clickOutside event
        // this fixes toggling programmatic
        this.$nextTick(() => {
          const value = !this.isActive
          this.isActive = value
          this.$emit('on-open', this.isActive)
          // Vue 2.6.x ???
          setTimeout(() => (this.isActive = value))
        })
      } else {
        this.isActive = !this.isActive
        this.$emit('on-open', this.isActive)
      }
    },
  },
  created() {
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.clickedOutside)
    }
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('click', this.clickedOutside)
    }
  },
}
</script>
