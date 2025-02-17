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
          :class="{ active: item.isActive }"
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
      type: [Array, Object],
      default: () => {},
    },
    value: {
      type: [String, Number],
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
    count: Array,
  },
  computed: {
    cleanStatus() {
      const status = []

      if (this.hasAll) {
        if (this.hasCount) {
          const total = this.count.reduce(
            (total, { count }) => total + count,
            0
          )
          status.push({
            value: '',
            text: `Tất cả (${total})`,
            isActive: !this.value,
          })
        } else {
          status.push({ value: '', text: 'Tất cả', isActive: !this.value })
        }
      }

      for (const key in this.status) {
        if (Object.hasOwnProperty.call(this.status, key)) {
          const item = this.status[key]
          let value = ''
          let text = ''

          if (typeof item === 'object') {
            text = capitalize(item.text)
            value = String(item.value)
          } else {
            text = capitalize(key)
            value = String(item)
          }

          if (this.hasCount) {
            text += ` (${this.mapCount[value] || 0})`
          }

          status.push({ value, text, isActive: value == this.value })
        }
      }

      return status
    },

    mapCount() {
      if (!this.hasCount) return {}
      const mapcount = {}
      for (const item of this.count) {
        mapcount[item.status] = item.count
      }

      return mapcount
    },

    hasCount() {
      return this.count !== undefined && this.count.length > 0
    },
  },
  methods: {
    handleClick(item) {
      if (this.value == item) return

      this.$emit('input', item)
      this.$emit('click', item)
    },
  },
}
</script>
