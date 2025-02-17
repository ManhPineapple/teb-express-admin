<template>
  <div class="pages setting">
    <div class="d-flex rate-action">
      <div class="d-flex t-types mb-20">
        <button
          v-for="item in types"
          :key="item.value"
          class="btn"
          :class="{ active: item.active }"
          @click="switchTypeHandle(item.value)"
          >{{ item.text }}</button
        >
      </div>
      <div class="d-flex">
        <div class="rate_value">Tỷ giá : {{ currencyRate }}</div>
        <div class="rate-btn" @click="visibleModalEdit()">Sửa tỷ giá</div>
      </div>
    </div>

    <div class="d-flex t-services mb-20">
      <button
        class="btn"
        v-for="service in services"
        :key="service.id"
        :class="{ active: service.id == filter.service }"
        @click="switchServiceHandle(service.id)"
      >
        {{ service.name }}
      </button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <VclTable v-if="isloading"></VclTable>
          <template v-else-if="prices.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="200">Hạng</th>
                    <th width="150">Dịch vụ</th>
                    <th width="200">Cân nặng</th>
                    <th width="100">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <PriceItem
                    v-for="(item, i) in prices"
                    :key="i"
                    :current="item"
                  />
                </tbody>
              </table>
            </div>

            <div class="actions text-right mt-20">
              <button
                class="btn btn-danger"
                @click="discardHandle"
                :disabled="!hasChangePrice"
                >Discard</button
              >
              <button
                class="btn btn-info ml-10"
                @click="saveHandle"
                :disabled="!hasChangePrice"
                >Save</button
              >
            </div>
          </template>
        </div>
      </div>
    </div>
    <edit-rate
      @save="handleEditRate"
      :visible.sync="visibleEdit"
      :loading="loadingEdit"
      :rate="rate"
    >
    </edit-rate>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import PriceItem from '../components/PriceItem.vue'
import EditRate from '../components/ModalEditRate.vue'
import { formatNumberV2 } from '@core/utils/formatter'
import {
  SWICTH_TYPE,
  SWICTH_SERVICE,
  FETCH_SERVICES,
  UPDATE_PRICES,
  DISCARD_UPDATE_PRICE,
  FETCH_RATE_EXCHANGE,
  UPDATE_RATE_EXCHANGE,
} from '../store'

export default {
  name: 'Prices',
  components: { PriceItem, EditRate },
  computed: {
    ...mapState('setting', {
      types: (state) => state.types,
      filter: (state) => state.filter,
      services: (state) => state.services,
      rate: (state) => state.rate_exchange,
    }),
    ...mapGetters('setting', ['prices', 'hasChangePrice']),
    currencyRate() {
      return formatNumberV2(this.rate)
    },
  },
  data() {
    return {
      isloading: false,
      visibleEdit: false,
      loadingEdit: false,
    }
  },
  mounted() {
    this.init()
    this.beforeLeaveHandle()
  },
  methods: {
    ...mapActions('setting', {
      switchType: SWICTH_TYPE,
      switchService: SWICTH_SERVICE,
      fetchServices: FETCH_SERVICES,
      updatePrices: UPDATE_PRICES,
      fetchRate: FETCH_RATE_EXCHANGE,
      updateRate: UPDATE_RATE_EXCHANGE,
    }),

    ...mapMutations('setting', {
      discardHandle: DISCARD_UPDATE_PRICE,
    }),

    async init() {
      this.isloading = true
      const res = await Promise.all([this.fetchServices(), this.fetchRate()])
      if (res.error) {
        this.$toast.error(res.message)
      }

      this.isloading = false
    },

    switchTypeHandle(value) {
      if (value == this.filter.user_class) return

      if (!this.hasChangePrice) {
        this.delayLoadHandle()
        this.switchType(value)
        return
      }

      this.$dialog.confirm({
        title: `Thông tin chưa được lưu, bạn có muốn chuyển tab khác?`,
        onConfirm: () => {
          this.discardHandle()
          this.delayLoadHandle()
          this.switchType(value)
        },
      })
    },
    async handleEditRate(body) {
      this.loadingEdit = true
      const payload = {
        price: body.price,
      }
      const res = await this.updateRate(payload)
      this.loadingEdit = false
      this.visibleEdit = false
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Thành công',
        duration: 3000,
      })
      this.init()
    },
    visibleModalEdit() {
      this.visibleEdit = true
    },
    switchServiceHandle(value) {
      if (value == this.filter.service) return

      if (!this.hasChangePrice) {
        this.delayLoadHandle()
        this.switchService(value)
        return
      }

      this.$dialog.confirm({
        title: `Thông tin chưa được lưu, bạn có muốn chuyển tab khác?`,
        onConfirm: () => {
          this.discardHandle()
          this.delayLoadHandle()
          this.switchService(value)
        },
      })
    },

    delayLoadHandle() {
      this.isloading = true
      setTimeout(() => {
        this.isloading = false
      }, 300)
    },

    async saveHandle() {
      this.isloading = true
      const res = await this.updatePrices()
      if (res.error) {
        this.$toast.error(res.message)
      } else {
        this.$toast.success('Update prices successfully!')
      }

      this.isloading = false
    },

    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (this.hasChangePrice) {
          return 'Thông tin chưa được lưu, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (this.hasChangePrice) {
      const answer = window.confirm(
        'Thông tin chưa được lưu, bạn có muốn thoát khỏi page?'
      )
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
}
</script>
<style lang="scss">
.t-types {
  .btn {
    border: 1px solid #ddd;
    border-radius: 0;
    + .btn {
      border-left: 0;
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &.active {
      color: #fff;
      background: #00b4c3;
      border-color: #00b4c3;
      cursor: initial;
    }
  }
}
.t-services {
  .btn {
    border: 1px solid #ddd;
    border-radius: 0;
    + .btn {
      margin-left: 15px;
    }

    &.active {
      color: #fff;
      background: #00b4c3;
      border-color: #00b4c3;
      cursor: initial;
    }
  }
}
.rate-action {
  justify-content: space-between;
  align-items: center;
}
.rate-btn,
.rate_value {
  height: 40px;
  line-height: 38px;
}
.rate_value {
  margin-right: 20px;
  font-weight: 600;
}
.rate-btn {
  border: 1px solid #ddd;
  padding: 0 12px;
  cursor: pointer;
  border-radius: 8px;
  background-color: #00b4c3;
  color: white;
  font-weight: 700;
}
</style>
