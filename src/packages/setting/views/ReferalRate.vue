<template>
  <div class="pages">
    <div class="page-content">
      <div
        class="card"
        style="
          max-width: 564px;
          margin: auto;
          padding: 80px;
          border: unset;
          margin-top: 150px;
        "
      >
        <div class="card-body">
          <div class="text-center">
            <label class="mb-24 lbn-rate-title"
              >Phần trăm quy đổi dựa trên doanh thu</label
            >
            <div class="form-rate">
              <p-input
                placeholder="Nhập phần trăm quy đổi"
                type="number"
                class="mb-12"
                v-model.number="rate"
              >
              </p-input>
              <span class="text-flex">%</span>
            </div>
            <p-button
              type="info"
              @click="saveReferalRateHandle"
              id="save-rate-btn"
            >
              Lưu
            </p-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { SAVE_REFERAL_RATE, FETCH_REFERAL_RATE } from '../store'

export default {
  name: 'ListSales',
  mixins: [mixinRoute, mixinTable],
  components: {},
  computed: {},
  data() {
    return {
      isFetching: false,
      isSubmitting: false,
      rate: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('setting', [SAVE_REFERAL_RATE, FETCH_REFERAL_RATE]),
    async init() {
      this.isFetching = true
      const res = await this[FETCH_REFERAL_RATE]()
      this.isFetching = false
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.rate = res.rate
    },
    async saveReferalRateHandle() {
      if (this.rate === '') {
        this.$toast.error('Phần trăm quy đổi không để trống')
        return
      }
      const payload = {
        rate: this.rate,
      }
      this.isSubmitting = true
      const res = await this[SAVE_REFERAL_RATE](payload)
      this.isSubmitting = false
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.$toast.success('Lưu phần trăm quy đổi thành công')
      this.init()
    },
  },
}
</script>
<style>
.form-rate {
  position: relative;
}
.text-flex {
  position: absolute;
  top: 8px;
  right: 14px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: #313232;
  display: inline-block;
  z-index: 999;
  width: 22px;
  height: 22px;
  background-color: #fff;
}
.lbn-rate-title {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: #313232;
}
#save-rate-btn {
  padding: 12px 20px;
  font-weight: 700;
  line-height: 20px;
  font-size: 14px;
  height: auto;
}
</style>
