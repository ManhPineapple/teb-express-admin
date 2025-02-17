<template>
  <div class="p-tabs nav-tabs-horizontal">
    <ul role="tablist" class="nav nav-tabs nav-tabs-line">
      <li
        role="presentation"
        class="nav-item"
        v-for="item in tabs"
        :id="item.id"
        :key="item.id"
      >
        <a
          href="#"
          class="nav-link"
          :class="{ active: item.active }"
          @click.prevent="handleClick(item.value)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { SHIPMENT_STATUS_TAB } from '../constants'

export default {
  name: 'StatusTab',
  props: {
    status: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Array],
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    tabs() {
      return SHIPMENT_STATUS_TAB.map((item) => ({
        id: `item_nav_${item.value}`,
        value: item.value,
        text: item.text,
        active: item.value === this.value,
      }))
    },
  },
  methods: {
    handleClick(item) {
      if (this.value !== item) {
        this.$emit('input', item)
        this.$emit('click', item)
      }
    },
  },
}
</script>
