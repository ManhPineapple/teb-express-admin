<template>
  <div class="p-tabs nav-tabs-horizontal">
    <ul role="tablist" class="nav nav-tabs nav-tabs-line">
      <li
        role="presentation"
        class="nav-item"
        v-for="(item, i) in cleanStatus"
        :key="i"
      >
        <a
          href="#"
          class="nav-link"
          :class="{ active: item.value === value }"
          @click.prevent="handleClick(item.value)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { capitalize } from '@core/utils/string'

export default {
  name: 'StatusTab',
  props: {
    status: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [String, Boolean, Number],
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    cleanStatus() {
      const status = this.hasAll ? [{ value: '', text: 'Tất cả' }] : []

      const listStatus = Object.keys(this.status)
      const listValues = Object.values(this.status)

      for (let i = 0; i < listStatus.length; i++) {
        status.push({
          value: String(listValues[i]),
          text: capitalize(listStatus[i]),
        })
      }

      return status
    },
  },
  methods: {
    handleClick(item) {
      if (this.$parent.$data.filter.page) {
        this.$parent.$data.filter.page = 1
      }
      if (this.value !== item) {
        this.$emit('input', item)
        this.$emit('click', item)
      }
    },
  },
}
</script>
