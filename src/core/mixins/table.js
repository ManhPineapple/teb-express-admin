import { cloneDeep } from '@core/utils'
import { roundNumberToTwoDecimalPlaces } from '@core/utils'

export default {
  computed: {
    totalSelected() {
      return this.action && this.action.selected
        ? this.action.selected.length
        : 0
    },
    paginationLabel() {
      const page = this.filter.page ? this.filter.page : 0
      const from = (page - 1) * this.filter.limit || 1
      const totalPage = Math.ceil(this.count / this.filter.limit)

      if (totalPage < this.filter.page || !from) {
        return ''
      }

      let to =
        this.count >= this.filter.limit ? page * this.filter.limit : this.count

      if (to > this.count) {
        to = this.count
      }

      return to > from
        ? // ? `Hiển thị ${from}-${to} trong tổng ${this.count} kết quả`
          `${this.count}`
        : `${this.count}`
    },
    selectedIds() {
      return this.action && this.action.selected && this.action.selected.length
        ? this.action.selected.map(({ id }) => id)
        : []
    },
    items() {
      return []
    },
    isAllChecked() {
      return (
        this.action.selected &&
        this.items.length == this.action.selected.length &&
        this.totalSelected > 0
      )
    },
    isIndeterminate() {
      return this.action.selected
        ? this.action.selected.length > 0 &&
            this.action.selected.length < this.items.length
        : false
    },
    selectionCountText() {
      return `${this.totalSelected} đơn hàng đang được chọn`
    },
    isChecked() {
      return function (value) {
        return (
          this.action.selected.some((e) => e.id == value.id) &&
          this.action.selected.length &&
          this.totalSelected > 0
        )
      }
    },
    isCheckedAll() {
      return function (value) {
        return (
          this.action.selected.includes(value) &&
          this.action.selected &&
          this.totalSelected > 0
        )
      }
    },
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 20,
        search: '',
      },
      action: {
        current: '',
        selected: [],
        visibleConfirm: false,
      },
      actions: {},
    }
  },
  methods: {
    /**
     * On multiple items selected
     * @param selected
     */
    onMultipleSelect(selected) {
      this.$set(this.action, 'selected', selected)
    },

    handleActionItem() {},

    /**
     * Handle action
     * @param current
     * @param item
     */
    handleAction(current, item = {}) {
      this.action.current = current
      this.action.item = item

      if (
        this.actions &&
        this.actions[current] &&
        this.actions[current].isNeedConfirm
      ) {
        this.$dialog.confirm({
          title: 'Are you sure you want to do this?',
          onConfirm: () => this.handleActionItem(),
        })
        return
      }

      this.handleActionItem()
    },

    handleSearch(e) {
      // Default result after search in page 1
      this.filter.page = 1
      this.$set(this.filter, 'search', e.target.value.trim())
    },
    checkClearSearch(e) {
      if (e.trim() === '') {
        this.filter.page = 1
        this.$set(this.filter, 'search', '')
      }
    },
    clearSearch() {
      this.$set(this.filter, 'search', '')
    },
    /**
     * On action confirm
     */
    onActionConfirm() {
      this.handleActionItem()
    },
    /**
     * Toggle select all
     */
    toggleSelectAll() {
      let selected = []
      if (this.isAllChecked) {
        selected = []
      } else {
        selected = cloneDeep(this.items)
      }
      this.$set(this.action, 'selected', selected)
    },

    /**
     * Tính phí cao điểm
     * @param weight
     */

    calculateFee() {
      if (
        !this.$store.state.shared.configs ||
        !this.$store.state.shared.configs.extra_fee
      )
        return 0
      const fee = parseFloat(this.$store.state.shared.configs.extra_fee)
      return roundNumberToTwoDecimalPlaces(fee, 2)
    },
  },
  watch: {
    $route: function () {
      if (this.action.selected) {
        this.$set(this.action, 'selected', [])
      }
    },
  },
}
