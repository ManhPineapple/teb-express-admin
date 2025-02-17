<template>
  <p-tooltip
    v-if="description"
    :label="description"
    size="large"
    position="top"
    type="dark"
    :active="true"
  >
    <span :class="classNames">{{ text }}</span>
  </p-tooltip>
  <span v-else :class="classNames">{{ text }}</span>
</template>
<script>
import { CONTAINER_ITEM_ACTIVE } from '../contants'

export default {
  name: 'ItemStatus',
  props: {
    current: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    classNames() {
      const classNames = ['badge', 'badge-round']
      if (this.current.item_status == CONTAINER_ITEM_ACTIVE) {
        classNames.push('badge-success')
        return classNames
      }

      classNames.push('badge-danger')
      return classNames
    },
    text() {
      if (this.current.item_status == CONTAINER_ITEM_ACTIVE) {
        return 'Thành công'
      }

      return 'Thất bại'
    },
    description() {
      return this.current.description || ''
    },
  },
}
</script>
