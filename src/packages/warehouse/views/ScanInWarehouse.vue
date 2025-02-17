<template>
  <div class="package-detail pages">
    <div class="page-content">
      <div class="page-content">
        <div class="row">
          <div class="col-12">
            <div class="card-block">
              <div class="card-body">
                <div class="d-flex">
                  <p-input
                    v-model="keyword"
                    @keydown.enter.prevent="inputHandle"
                    placeholder="Nhập mã vận đơn"
                  ></p-input>
                  <button
                    @click="inputHandle"
                    class="btn btn-info ml-3 text-nowrap"
                    >Quét</button
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card-block">
              <div class="card-content">
                <div class="table-responsive">
                  <table class="table table-borderless tb-scan-in">
                    <tr>
                      <td>Mã vận đơn:</td>
                      <td>{{
                        pkg.package_code ? pkg.package_code.code : ''
                      }}</td>
                    </tr>
                    <tr>
                      <td>Người gửi:</td>
                      <td>{{ sender }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="card-block">
              <div class="card-content">
                <div class="table-responsive">
                  <table class="table table-borderless tb-scan-in">
                    <tr>
                      <td>Người nhận:</td>
                      <td>{{ pkg.recipient }}</td>
                    </tr>
                    <tr>
                      <td>Số điện thoại:</td>
                      <td v-if="pkg.id">{{ pkg.phone_number || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td>Địa chỉ:</td>
                      <td>{{ pkg.address_1 }}</td>
                    </tr>
                    <tr v-if="pkg.address_2">
                      <td>Địa chỉ:</td>
                      <td>{{ pkg.address_2 }}</td>
                    </tr>
                    <tr>
                      <td>Thành phố:</td>
                      <td>{{ pkg.city }}</td>
                    </tr>
                    <tr>
                      <td>Mã bang:</td>
                      <td>{{ pkg.state_code }}, {{ pkg.country_code }}</td>
                    </tr>
                    <tr>
                      <td>Mã bưu điện:</td>
                      <td>{{ pkg.zipcode }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card-block">
              <div class="card-content">
                <div class="table-responsive">
                  <table class="table table-borderless tb-scan-in">
                    <tr>
                      <td>Mã đơn hàng:</td>
                      <td>{{ pkg.order_number }}</td>
                    </tr>
                    <tr>
                      <td>Chi tiết hàng hóa:</td>
                      <td>{{ pkg.detail }}</td>
                    </tr>
                    <tr>
                      <td>Trọng lượng:</td>
                      <td v-if="pkg.id">{{ pkg.weight }} (grams)</td>
                    </tr>
                    <tr>
                      <td>Dài x Rộng x Cao:</td>
                      <td v-if="pkg.id"
                        >{{ pkg.length }}x{{ pkg.width }}x{{
                          pkg.height
                        }}
                        (cm)</td
                      >
                    </tr>
                    <tr>
                      <td>Dịch vụ:</td>
                      <td>{{ pkg.service ? pkg.service.name : '' }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { WAREHOUSE_CHECK_IN } from '../store/index'
import mixinBarcode from '@core/mixins/barcode'
import {
  PACKAGE_WAREHOUSE_STATUS_RETURN,
  PACKAGE_WAREHOUSE_STATUS_CANCELLED,
  PACKAGE_WAREHOUSE_STATUS_PICK,
} from '../constants'

export default {
  name: 'PackageDetail',
  mixins: [mixinBarcode],
  data() {
    return {
      keyword: '',
      isScanning: false,
    }
  },
  computed: {
    ...mapState('warehouse', {
      pkg: (state) => state.package,
    }),

    sender() {
      if (!this.pkg.user) return ''
      const { full_name, email, phone_number: phone } = this.pkg.user
      if (full_name) return `${full_name}-${email || phone}`
      return email && phone ? `${email}-${phone}` : email || phone
    },
  },
  mounted() {
    this.setPackage({})
  },
  methods: {
    ...mapActions('shared', ['loading']),
    ...mapActions('warehouse', {
      checkIn: WAREHOUSE_CHECK_IN,
    }),
    ...mapMutations('warehouse', {
      setPackage: WAREHOUSE_CHECK_IN,
    }),

    inputHandle() {
      this.keyword = this.keyword.trim()
      this.fetchPackage()
    },

    barcodeSubmit(keyword) {
      this.keyword = keyword.trim()
      this.fetchPackage()
    },

    async fetchPackage() {
      this.setPackage({})
      if (this.keyword === '') return

      this.isScanning = true
      this.loading(true)
      const res = await this.checkIn(this.keyword)
      this.isScanning = false
      this.loading(false)

      if (!res || res.error) {
        this.$toast.error(res.message)
        return
      }

      if (this.pkg.status == PACKAGE_WAREHOUSE_STATUS_CANCELLED) {
        this.$toast.error('Đơn hàng đã được huỷ')
        return
      }

      if (this.pkg.status == PACKAGE_WAREHOUSE_STATUS_RETURN) {
        this.$toast.error('Đơn hàng đã được hoàn trả')
        return
      }

      if (this.pkg.status >= PACKAGE_WAREHOUSE_STATUS_PICK) {
        this.$toast.warning('Đơn hàng đã được quét vào kho trước đó')
        return
      }

      this.$toast.success('Đơn hàng đã được quét vào kho thành công')
    },
  },
}
</script>
<style lang="scss">
.tb-scan-in {
  line-height: 32px;
  tr td:first-child {
    width: 150px;
  }
}
</style>
