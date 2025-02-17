<template>
  <div>
    <multiselect
      class="multiselect-custom"
      v-model="selected"
      :options="promotions"
      :placeholder="label"
      :custom-label="customLabel"
      :loading="isLoading"
      @search-change="fetchPromotions"
      @select="handleSelect"
      @remove="handleRemove"
      :showDropdown="false"
    >
    </multiselect>
    <div
      v-if="selected"
      class="multiselect__clear"
      @click.prevent="handleRemove"
    >
      <p-svg name="x"></p-svg>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import api from '@/packages/promotion/api'

export default {
  name: 'SearchPromotion',
  props: {
    value: {
      type: [Number, String, Object],
      default: 0,
    },
    filter: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: 'Search user',
    },
    search: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: null,
      isLoading: false,
      promotions: [],
    }
  },
  mounted() {
    this.handleSearch()
  },
  created() {
    this.handleSearch = debounce(async function (search = '') {
      this.isLoading = true
      let response = await api.fetchPromotion(
        Object.assign({}, this.filter, { search: search })
      )
      if (response && response.errorMessage) {
        this.promotions = []
        return
      }
      this.promotions = response.promotions
      this.isLoading = false
      if (this.search != '') {
        this.selected = this.promotions.filter((x) => x.name == this.search)
        this.promotion = this.promotions.find((x) => x.name == this.search)
        this.$emit('input', this.promotion)
      }
    }, 500)
  },
  methods: {
    async fetchPromotions(search = '') {
      this.isLoading = true
      const result = await api.fetchPromotion(
        Object.assign({}, this.filter, { search: search.trim() })
      )
      this.isLoading = false

      if (result && result.errorMessage) {
        this.promotions = []
        return
      }
      // if (this.filter.code) {
      //   this.selected = result.users ? result.users[0] : ''
      //   this.handleSelect(this.selected)
      // }
      this.promotions = result.promotions
    },

    customLabel({ name }) {
      return `${name}`
    },

    handleSelect(promotion) {
      this.$emit('input', promotion.name)
    },

    handleRemove() {
      this.selected = null
      this.$emit('input', '')
    },
  },
  // watch: {
  //   filter: {
  //     handler: function() {
  //       this.fetchUsers()
  //     },
  //     deep: true,
  //   },
  // },
}
</script>

<style lang="scss">
.user-resource {
  width: 100%;
  position: relative;
}
.multiselect__clear {
  line-height: 40px;
  display: block;
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  right: 1px;
  text-align: center;
  cursor: pointer;
  z-index: 4;
}
</style>
