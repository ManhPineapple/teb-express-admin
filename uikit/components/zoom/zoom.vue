<template>
  <transition :name="animation">
    <div v-if="isActive" class="p-dialog p-modal is-active">
      <div class="p-modal-background" @click="close()"></div>
      <div class="p-modal-card p-animation-content">
        <div class="modal-content">
          <img :src="url" :alt="alt" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { removeElement } from '../../utils/dom'

export default {
  name: 'PImageZoom',
  props: {
    url: String,
    alt: String,
    active: Boolean,
    animation: {
      type: String,
      default: 'zoom-out',
    },
  },
  data() {
    return {
      isActive: false,
    }
  },
  methods: {
    close() {
      this.isActive = false
      setTimeout(() => {
        this.$destroy()
        removeElement(this.$el)
      }, 150)
    },
  },
  beforeMount() {
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
  },
  mounted() {
    this.isActive = true
  },
}
</script>
