<template>
  <div class="debt__search">
    <p-modal :active="visible" @close="handleClose" :title="`Bộ lọc`">
      <template>
        <div class="price">
          <div class="title font-weight-600">Bảng giá:</div>
          <div class="list-option">
            <div class="item checkbox-custom">
              <input
                type="checkbox"
                v-model="allSelected"
                @click="checkAll"
                id="all_price"
              />
              <label for="all_price">Tất cả</label>
              <div
                v-for="(item, i) in option"
                :key="i"
                class="item checkbox-custom"
              >
                <input
                  type="checkbox"
                  :id="item.name"
                  name="status"
                  :value="item.value"
                  v-model="filter.status_arr"
                />
                <label :for="item.name">{{ item.label }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="payment">
          <div class="title font-weight-600">Kiểu thanh toán:</div>
          <div class="list-option">
            <div class="item checkbox-custom">
              <input
                type="checkbox"
                v-model="allPaymentSelected"
                @click="checkAllPayment"
                id="all_payment"
              />
              <label for="all_payment">Tất cả</label>
              <div
                v-for="(item, i) in optionPayment"
                :key="i"
                class="item checkbox-custom"
              >
                <input
                  type="checkbox"
                  :id="item.name"
                  name="payment"
                  :value="item.value"
                  v-model="filter.payment_arr"
                />
                <label :for="item.name">{{ item.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="">
          <div class="">
            <p-button type="info" @click="handleExport"> Tìm kiếm </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import mixinRoute from '@core/mixins/route'
export default {
  name: 'ModalSearch',
  mixins: [mixinRoute],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadingView: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filter: {
        status_arr: [],
        payment_arr: [],
        page: 1,
        limit: 30,
        status: 1,
      },
      allSelected: false,
      allPaymentSelected: false,
      err: false,
      option: [
        {
          name: 'public',
          value: 'public',
          label: 'Public',
        },
        {
          name: 'priority',
          value: 'priority',
          label: 'Priority',
        },
      ],
      optionPayment: [
        {
          name: 'prepay',
          value: 'prepay',
          label: 'Trả trước',
        },
        {
          name: 'postpaid',
          value: 'postpaid',
          label: 'Trả sau',
        },
      ],
    }
  },
  computed: {},
  created() {
    this.filter = this.getRouteQuery()
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },

    handleExport() {
      if (
        this.filter.status_arr.length == 0 &&
        this.filter.payment_arr.length == 0
      ) {
        this.$toast.error('Hãy chọn điều kiện tìm kiếm')
        return
      }
      const params = {
        price_arr: this.filter.status_arr,
        prepay: this.filter.payment_arr.includes('prepay') ? '1' : '',
        postpaid: this.filter.payment_arr.includes('postpaid') ? '1' : '',
        page: 1,
        limit: 30,
        status: 1,
      }
      this.$emit('fetch', params)
      this.handleClose()
    },
    checkAll() {
      this.filter.status_arr = []
      var checkboxes = document.getElementsByName('status')
      if (!this.allSelected) {
        for (var i = 0, n = checkboxes.length; i < n; i++) {
          this.filter.status_arr.push(checkboxes[i].value)
        }
      }
    },
    checkAllPayment() {
      this.filter.payment_arr = []
      let checkboxes = document.getElementsByName('payment')
      if (!this.allPaymentSelected) {
        for (var i = 0, n = checkboxes.length; i < n; i++) {
          this.filter.payment_arr.push(checkboxes[i].value)
        }
      }
    },
  },
  watch: {
    'filter.status_arr'() {
      this.allSelected =
        this.filter.status_arr.length == this.option.length ? true : false
    },
    'filter.payment_arr'() {
      this.allPaymentSelected =
        this.filter.payment_arr.length == this.optionPayment.length
          ? true
          : false
    },
    visible() {
      this.filter = this.getRouteQuery()
    },
  },
}
</script>
