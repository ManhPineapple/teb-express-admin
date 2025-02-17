<template>
  <div>
    <label class="color-newtral-10 font-weight-600 mb-5">Support:</label>
    <multiselect
      class="multiselect-custom dropdown-order"
      :options="optionSearch"
      :placeholder="placeHolder"
      :custom-label="customLabel"
      :loading="isLoading"
      :item="item"
      :openDirection="'below'"
      @select="handleSelect"
      @remove="handleRemove"
      :multiple="true"
      track-by="name"
      v-model="users"
    >
      <template slot="tag">{{ '' }}</template>
    </multiselect>

    <div class="mt-16">
      <label class="color-newtral-10 font-weight-600 mb-5"
        >Danh sách support:</label
      >
      <multiselect
        class="multiselect-custom dropdown-order list-customer"
        :options="optionSearch"
        :placeholder="placeHolder"
        :custom-label="customLabel"
        :loading="isLoading"
        :item="item"
        @select="handleSelect"
        @remove="handleRemove"
        :multiple="true"
        track-by="name"
        v-model="users"
      >
      </multiselect
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SelectSupport',
  props: {
    index: {
      type: Number,
      default: 1,
    },
    value: {
      type: [Number, String],
      default: 'transaction-type',
    },
    placeHolder: {
      type: String,
      default: '',
    },
    filter: {
      type: Object,
      default: () => {},
    },
    optionSearch: {
      type: Array,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selected: {
        key: 'more-filter',
        name: 'Thêm support',
      },
      isLoading: false,
      users: [],
    }
  },
  mounted() {
    if (this.item && this.item.support_id.length > 0) {
      this.users = this.optionSearch.filter((item) =>
        this.item.support_id.includes(item.key)
      )
    }
  },
  methods: {
    customLabel({ key, name }) {
      return typeof key !== 'undefined' ? `${name}` : ''
    },

    handleSelect(value) {
      this.$emit('selected', value.key)
    },

    handleRemove(item) {
      this.$emit('unselected', item.key)
    },
  },
  watch: {
    optionSearch: {
      handler: function () {
        if (this.item && this.item.support_id.length > 0) {
          this.users = this.optionSearch.filter((item) =>
            this.item.support_id.includes(item.key)
          )
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
