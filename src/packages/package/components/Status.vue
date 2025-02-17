<template>
  <span :class="className">{{ text }}</span>
</template>

<script>
import { MAP_SHIPMENT_STATUS } from '../constants'

export default {
  name: 'Status',
  props: {
    status: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    className() {
      const className =
        (MAP_SHIPMENT_STATUS[this.status] || {}).className || 'unknown'
      return `badge badge-round badge-${className}`
    },
    text() {
      return (MAP_SHIPMENT_STATUS[this.status] || {}).text || 'unknown'
    },
  },
}
</script>
