<template>
  <transition :name="transitionName">
    <div v-show="isActive && visible" class="tab-item">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PTabItem',
  props: {
    label: String,
    icon: String,
    disabled: Boolean,
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: false,
      transitionName: null,
    }
  },
  methods: {
    activate(oldIndex, index) {
      if (!this.$parent.animated) {
        this.transitionName = null
      } else {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev'
      }
      this.isActive = true
    },
    deactivate(oldIndex, index) {
      if (!this.$parent.animated) {
        this.transitionName = null
      } else {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev'
      }
      this.isActive = false
    },
  },
  created() {
    this.$parent.tabItems.push(this)
  },
  beforeDestroy() {
    const index = this.$parent.tabItems.indexOf(this)
    if (index >= 0) {
      this.$parent.tabItems.splice(index, 1)
    }
  },
}
</script>
