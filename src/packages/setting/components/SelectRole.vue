<template>
  <multiselect
    class="multiselect-custom dropdown-order"
    v-model="selected"
    :options="optionSearch"
    :placeholder="placeHolder"
    :custom-label="customLabel"
    :loading="isLoading"
    :item="item"
    :openDirection="'below'"
    @select="handleSelect"
    @remove="handleRemove"
    :disabled="disabled"
  >
  </multiselect>
</template>

<script>
export default {
  name: 'SelectRole',
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: {
        key: 'more-filter',
        name: this.placeHolder,
      },
      isLoading: false,
      users: [],
    }
  },
  created() {
    this.update()
  },
  methods: {
    update() {
      this.selected = this.item
        ? this.optionSearch.find(
            ({ key }) => key == this.item.role || key == this.item.warehouse_id
          )
        : this.selected
    },

    customLabel({ key, name }) {
      return typeof key !== 'undefined' ? `${name}` : ''
    },

    handleSelect(value) {
      this.$emit('selected', value.key, this.item, this.index)
    },

    handleRemove() {
      this.$emit('unselected', true)
    },
  },
  watch: {
    item: {
      handler: function() {
        this.update()
      },
      deep: true,
    },
  },
}
</script>
