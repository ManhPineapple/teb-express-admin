<template>
  <div id="nav_container" class="p-tabs nav-tabs-horizontal mt-24">
    <button class="icon-nav next" @click="clickLeftNav">
      <i class="left-nav"></i>
    </button>
    <button class="icon-nav prev active" @click="clickRightNav">
      <i class="right-nav"></i>
    </button>
    <ul
      role="tablist"
      class="nav nav-tabs nav-tabs-line"
      id="nav_packages"
      :style="setRight"
    >
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
  name: 'PackageStatusTab',
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
          this.countStatus.forEach((obj) => {
            total += parseInt(obj.count)
            if (obj.status === item.value) {
              count = obj.count
            }
          })

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
    setRight() {
      return 'right:' + this.right + 'px;'
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
    clickLeftNav() {
      if (!this.el) {
        return
      }
      if (this.el === 1) {
        document.getElementsByClassName('next')[0].classList.remove('active')
        document.getElementsByClassName('prev')[0].classList.add('active')
      } else {
        document.getElementsByClassName('prev')[0].classList.add('active')
        document.getElementsByClassName('next')[0].classList.add('active')
      }
      this.el--
      let selector = 'item_nav_' + this.el
      this.right = document.getElementById(selector).offsetLeft - 34
    },
    getStop() {
      let width = 0
      let stop = 0
      for (
        let index = document.getElementById('nav_packages').children.length - 1;
        index >= 0;
        index--
      ) {
        const el = 'item_nav_' + index
        width += document.getElementById(el).offsetWidth
        if (width > document.getElementById('nav_container').offsetWidth - 68) {
          stop = index + 1
          break
        }
      }
      return stop
    },
    clickRightNav() {
      const stop = this.getStop()

      if (this.el === stop) {
        return
      }
      if (this.el + 1 === stop) {
        document.getElementsByClassName('prev')[0].classList.remove('active')
        document.getElementsByClassName('next')[0].classList.add('active')
      } else {
        document.getElementsByClassName('prev')[0].classList.add('active')
        document.getElementsByClassName('next')[0].classList.add('active')
      }
      this.el++
      let selector = 'item_nav_' + this.el

      this.right = document.getElementById(selector).offsetLeft - 34
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
