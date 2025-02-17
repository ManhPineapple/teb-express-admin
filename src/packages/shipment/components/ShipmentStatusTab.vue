<template>
  <div id="nav_container" class="p-tabs nav-tabs-horizontal">
    <ul role="tablist" class="nav nav-tabs nav-tabs-line">
      <li
        role="presentation"
        class="nav-item"
        v-for="(item, i) in cleanStatus"
        :id="getClass(i)"
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
  name: 'ShipmentStatusTab',
  props: {
    status: {
      type: Array,
      default: () => [],
    },
    countStatus: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      right: 0,
      el: 0,
    }
  },
  computed: {
    cleanStatus() {
      const status = this.hasAll ? [{ value: '', text: 'All' }] : []
      this.status.forEach((item) => {
        if (typeof item === 'object') {
          let count
          let total = 0
          if (this.countStatus) {
            this.countStatus.forEach((obj) => {
              total += parseInt(obj.count)
              if (obj.status === item.value) {
                count = obj.count
              }
            })
          }

          let countText = count ? ' (' + count + ')' : ' (0)'
          if (item.value === '') {
            countText = ' (' + total + ')'
          }

          status.push({
            value: item.value,
            text: capitalize(item.text) + countText,
          })
        } else {
          status.push({ value: item, text: capitalize(item) })
        }
      })
      return status
    },
  },
  methods: {
    handleClick(item) {
      if (this.value !== item) {
        this.$emit('input', item)
        this.$emit('click', item)
      }
    },
    getClass(i) {
      return 'item_nav_' + i
    },
  },
}
</script>
<style>
@media only screen and (max-width: 1366px) {
  .icon-nav {
    display: block !important;
  }
  ul#nav_packages {
    padding-left: 35px !important;
    width: 400%;
  }
}
@media only screen and (min-width: 1367px) {
  ul#nav_packages {
    right: 0 !important;
  }
}
</style>
