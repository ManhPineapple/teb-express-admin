<template>
  <div class="p-tabs nav-tabs-horizontal" :class="{ 'is-fullwidth': expanded }">
    <ul class="nav nav-tabs nav-tabs-line" role="tablist">
      <li
        v-for="(tabItem, index) in tabItems"
        :key="index"
        v-show="tabItem.visible"
        class="nav-item"
        role="presentation"
      >
        <a
          class="nav-link"
          :class="[
            itemClass,
            {
              active: activeTab === index,
              disabled: tabItem.disabled,
            },
          ]"
          role="tab"
          @click="tabClick(index)"
        >
          <p-icon v-if="tabItem.icon" :name="tabItem.icon"> </p-icon>
          <span>{{ tabItem.label }}</span>
        </a>
      </li>
    </ul>
    <section class="tab-content">
      <slot />
    </section>
  </div>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name: 'PTabs',
  components: {
    PIcon: Icon,
  },
  props: {
    value: Number,
    type: String,
    size: String,
    expanded: Boolean,
    position: String,
    animated: {
      type: Boolean,
      default: true,
    },
    itemClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeTab: this.value || 0,
      tabItems: [],
    }
  },
  methods: {
    changeTab(newIndex) {
      if (this.activeTab === newIndex) return
      if (this.activeTab < this.tabItems.length) {
        this.tabItems[this.activeTab].deactivate(this.activeTab, newIndex)
      }
      if (this.tabItems[newIndex]) {
        this.tabItems[newIndex].activate(this.activeTab, newIndex)
        const oldIndex = this.activeTab
        this.activeTab = newIndex
        this.$emit('change', newIndex, oldIndex)
      }
    },
    tabClick(value) {
      this.$emit('input', value)
      this.changeTab(value)
    },
  },
  watch: {
    value(value) {
      this.changeTab(value)
    },
    tabItems() {
      if (this.activeTab < this.tabItems.length) {
        this.tabItems[this.activeTab].isActive = true
      }
    },
  },
  mounted() {
    if (this.activeTab < this.tabItems.length) {
      this.tabItems[this.activeTab].isActive = true
    }
  },
}
</script>
