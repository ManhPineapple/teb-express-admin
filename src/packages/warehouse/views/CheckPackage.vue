<template>
  <div class="pages check-package">
    <div class="page-content">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex">
                <p-input
                  ref="input"
                  :value="keyword"
                  @keydown.enter.prevent="searchHandle"
                  placeholder="Nhập AnanBay tracking"
                ></p-input>
                <button
                  :disabled="disBtnAccept"
                  @click="quickAcceptHandle(null)"
                  class="btn btn-info ml-3 text-nowrap"
                  >In label</button
                >
                <button
                  v-if="showBtnHub"
                  @click="showModalChoiceHub"
                  class="btn btn-info ml-3 text-nowrap"
                  >Chọn hub</button
                >
                <button
                  v-if="tracking.id"
                  @click="confirmCancelLabel"
                  class="btn btn-danger ml-3 text-nowrap"
                  >Hủy label</button
                >
              </div>
            </div>
          </div>
          <div class="card mt-5">
            <div class="card-body">
              <div class="row">
                <p class="col-6"
                  >AnanBay tracking:
                  <b>{{
                    current.package_code ? current.package_code.code : 'N/A'
                  }}</b>
                </p>
                <p class="col-6"
                  >Destination Hub:
                  <b
                    >{{
                      current.tracking && current.tracking.warehouse
                        ? `Hub ${current.tracking.warehouse.state}`
                        : 'N/A'
                    }}
                  </b>
                </p>
              </div>
              <div class="row">
                <p class="col-6"
                  >Last mile tracking:
                  <b>{{
                    current.tracking ? current.tracking.tracking_number : 'N/A'
                  }}</b>
                </p>
                <p class="col-6"
                  >Label:
                  <b>{{
                    current.label_promotion
                      ? count_tracking > 1
                        ? 'Dán lại label + sticker'
                        : 'Dán sticker'
                      : 'Dán label'
                  }}</b>
                </p>
              </div>
              <div class="row">
                <p class="col-6"
                  >Người gửi:
                  <b>{{ current.user ? current.user.full_name : 'N/A' }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="card mt-5">
            <div class="card-header">
              <div class="card-title">Kiểm tra số đo</div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng gốc(gram):</label>
                    <p-input
                      :value="current.weight"
                      type="text"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.length"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.width"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.height"
                      readonly
                    ></p-input>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng thực(gram):</label>
                    <p-input
                      type="text"
                      v-model.number="volume.weight"
                      @input="validateInput($event, 'weight')"
                      placeholder="eg: 69 (đơn vị grams)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="volume.length"
                      @input="validateInput($event, 'length')"
                      placeholder="eg: 15 (đơn vị cm)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="volume.width"
                      placeholder="eg: 10 (đơn vị cm)"
                      @input="validateInput($event, 'width')"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="volume.height"
                      @input="validateInput($event, 'height')"
                      placeholder="eg: 3 (đơn vị cm)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="isVisilbeModalConfirmCancel"
      :type="`danger`"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn muốn hủy label ?`"
      :title="`Xác nhận hủy`"
      @action="cancelLabelHandler"
    ></modal-confirm>
    <modal-choice-hub
      @label="quickAcceptHandle"
      :visible.sync="visibleModalChoiceHub"
      :country="pkgCountry"
    ></modal-choice-hub>
  </div>
</template>
<script>
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import mixinBarcode from '@core/mixins/barcode'
import { print } from '@core/utils/print'
import { mapActions, mapMutations, mapState } from 'vuex'
import { FETCH_SERVICE, FETCH_WAREHOUSE } from '../../shared/store'
import ModalChoiceHub from '../components/ModalChoiceHub'
import { PACKAGE_WAREHOUSE_STATUS_PICK } from '../constants'
import {
  ACCEPT_PACKAGE_LABEL,
  CANCEL_LABEL,
  FETCH_PACKAGE_DETAIL,
  RETURN_PACKAGE,
} from '../store'

export default {
  name: 'CheckPackage',
  mixins: [mixinBarcode],
  components: {
    ModalChoiceHub,
    ModalConfirm,
  },
  computed: {
    ...mapState('warehouse', {
      current: (state) => state.package,
      count_tracking: (state) => state.count_tracking_in_package,
    }),
    ...mapState('shared', {
      service_detail: (state) => state.service_detail,
      estimateCost: (state) => state.estimateCost,
      wareHouses: (state) => state.wareHouses,
    }),
    pkgCountry() {
      return this.current ? this.current.country_code : ''
    },
    messages() {
      if (!this.current.id) return []

      const messages = []
      if (this.volume.weight > this.current.weight) {
        messages.push('Trọng lượng vượt ngưỡng')
      }

      if (this.volume.length > this.current.length) {
        messages.push('Chiều dài vượt ngưỡng')
      }

      if (this.volume.width > this.current.width) {
        messages.push('Chiều rộng vượt ngưỡng')
      }

      if (this.volume.height > this.current.height) {
        messages.push('Chiều cao vượt ngưỡng')
      }

      return messages
    },
    disInput() {
      return (
        !this.current.id || this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    isAccepted() {
      return (
        this.current.id && this.current.status > PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    disReturn() {
      return (
        !this.current.id || this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    showBtnHub() {
      return this.current.tracking === null && this.$isAdmin()
    },
    disBtnReturn() {
      return (
        !this.current.id ||
        this.note === '' ||
        this.isSubmitting ||
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    disBtnAccept() {
      return !this.current.id || this.isSubmitting || this.isFetching
    },
    disBtnIncurred() {
      return (
        !this.messages.length ||
        this.isSubmitting ||
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK ||
        !this.volume.weight ||
        !this.volume.length ||
        !this.volume.width ||
        !this.volume.height
      )
    },
    tracking() {
      return this.current.tracking || {}
    },
  },
  data() {
    return {
      keyword: '',
      isFetching: false,
      note: '',
      volume: {
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
      },
      isChange: false,
      isVisibleModalAccept: false,
      isVisilbeModalConfirmCancel: false,
      isSubmitting: false,
      visibleModalChoiceHub: false,
    }
  },
  mounted() {
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword.trim()
      this.fetchPackageSubmit()
    } else {
      this.setPackage({ package: {}, count_tracking: 0 })
    }

    this.beforeLeaveHandle()
  },
  methods: {
    ...mapActions('shared', ['loading', FETCH_SERVICE, FETCH_WAREHOUSE]),
    ...mapActions('warehouse', {
      fetchPackage: FETCH_PACKAGE_DETAIL,
      acceptPackageSubmit: ACCEPT_PACKAGE_LABEL,
      returnPackageSubmit: RETURN_PACKAGE,
      cancelLabel: CANCEL_LABEL,
    }),
    ...mapMutations('warehouse', {
      setPackage: FETCH_PACKAGE_DETAIL,
    }),
    confirmCancelLabel() {
      this.isVisilbeModalConfirmCancel = true
    },
    async cancelLabelHandler() {
      this.isVisilbeModalConfirmCancel = false
      this.loading(true)
      this.isSubmitting = true
      const body = { tracking_number: this.tracking.tracking_number }
      const res = await this.cancelLabel(body)
      this.isSubmitting = false
      this.loading(false)

      if (!res.success) {
        this.$toast.error(res.message)
        return
      }
      this.$toast.success('Hủy label thành công')
      this.fetchPackageSubmit()
    },
    searchHandle(e) {
      const keyword = e.target.value
      if (keyword == 'PrintAnanBayLabel') this.printLabel()
      else this.beforeFetchPackge(keyword || '')
    },

    barcodeSubmit(keyword) {
      if (keyword == 'PrintAnanBayLabel') this.printLabel()
      else this.beforeFetchPackge(keyword)
    },

    beforeFetchPackge(keyword) {
      keyword = keyword.trim()
      if (keyword.length == 38) {
        keyword = keyword.slice(-26).trim()
      } else if (keyword.length > 40) {
        keyword = keyword.slice(-23).trim()
      }
      // else if (keyword.length > 24) {
      //   keyword = keyword.slice(-22).trim()
      // }
      if (this.keyword === keyword) return

      if (!this.current.id || this.isAccepted) {
        this.keyword = keyword
        this.pushQuery(keyword)
        this.fetchPackageSubmit()
        return
      }

      this.$dialog.confirm({
        title: `Xác nhận duyệt AnanBay tracking ${this.keyword}?`,
        message: 'Đơn hàng chưa duyệt. Bạn có muốn duyệt không.',
        onConfirm: () => {
          this.quickAcceptHandle()
        },
        onCancel: () => {
          this.keyword = keyword
          this.pushQuery(keyword)
          this.fetchPackageSubmit()
        },
      })
    },
    showModalChoiceHub() {
      this.visibleModalChoiceHub = true
    },
    pushQuery(keyword) {
      this.$router.push({
        query: { keyword: keyword },
        path: this.$route.path,
      })
    },

    async fetchPackageSubmit() {
      if (this.keyword === '') return

      this.reset()

      this.loading(true)
      this.isFetching = true
      const res = await this.fetchPackage(this.keyword)
      this.isFetching = false
      this.loading(false)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.volume.weight =
        this.current.actual_weight > 0
          ? this.current.actual_weight
          : this.current.weight
      this.volume.length =
        this.current.actual_length > 0
          ? this.current.actual_length
          : this.current.length
      this.volume.width =
        this.current.actual_width > 0
          ? this.current.actual_width
          : this.current.width
      this.volume.height =
        this.current.actual_height > 0
          ? this.current.actual_height
          : this.current.height
    },

    quickAcceptHandle(hub_id) {
      if (this.tracking.id) {
        this.printLabel()
        return
      }

      if (
        parseFloat(this.volume.weight) != parseFloat(this.current.weight) ||
        parseFloat(this.volume.length) != parseFloat(this.current.length) ||
        parseFloat(this.volume.width) != parseFloat(this.current.width) ||
        parseFloat(this.volume.height) != parseFloat(this.current.height)
      ) {
        this.extraHandle(hub_id)
        return
      }

      this.volume.weight = this.current.weight
      this.volume.length = this.current.length
      this.volume.width = this.current.width
      this.volume.height = this.current.height
      this.showModalAcceptHandle(hub_id)
    },
    validateInput(e, atrr) {
      e = e.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
      this.volume[atrr] =
        e.indexOf('.') >= 0
          ? e.substr(0, e.indexOf('.')) + e.substr(e.indexOf('.'), 3)
          : e
    },
    async showModalAcceptHandle(hub_id) {
      let req = { type: 1, status: 1 }
      let [result, result3] = await Promise.all([
        this[FETCH_SERVICE](this.current.service_id),
        this[FETCH_WAREHOUSE](req),
      ])
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      if (!result3.success) {
        this.$toast.open({ message: result3.message, type: 'error' })
        return
      }
      let warehouseOptions = []
      this.wareHouses.forEach((warehouse) => {
        let exist = this.estimateCost.find(
          (cost) => cost.warehouse_id === warehouse.id
        )
        let cost = 0
        if (exist) {
          cost = exist.cost
        }
        warehouseOptions.push({
          id: warehouse.id,
          cost: cost,
        })
      })

      this.acceptHandle(this.service_detail.domestic_carrier.code, hub_id)
    },

    extraHandle(hub_id) {
      this.$dialog.confirm({
        title: 'Xác nhận thay đổi trọng lượng và kích thước?',
        onConfirm: () => this.showModalAcceptHandle(hub_id),
      })
    },

    async acceptHandle(carrier, hub_id) {
      if (this.tracking.id) {
        this.printLabel()
        return
      }
      if (!carrier) {
        return this.$toast.error('Vui lòng chọn Loại vận chuyển')
      }

      if (this.isSubmitting) return

      this.loading(true)
      this.isSubmitting = true
      const body = {
        id: this.current.id,
        carrier: carrier,
        hub_id: null,
      }
      if (hub_id) {
        body.hub_id = hub_id
      }

      body.weight = parseFloat(this.volume.weight) || 0
      body.length = parseFloat(this.volume.length) || 0
      body.width = parseFloat(this.volume.width) || 0
      body.height = parseFloat(this.volume.height) || 0

      const res = await this.acceptPackageSubmit(body)
      this.isSubmitting = false
      this.loading(false)
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.fetchPackageSubmit()
      this.printLabel()
    },

    returnHandleConfirm() {
      this.$dialog.confirm({
        title: 'Xác nhận trả hàng?',
        onConfirm: () => this.returnHandle(),
      })
    },

    async returnHandle() {
      if (this.isSubmitting || !this.current.id || this.note == '') return

      this.loading(true)
      this.isSubmitting = true
      const body = { id: this.current.id, note: this.note }
      const res = await this.returnPackageSubmit(body)
      this.isSubmitting = false
      this.loading(false)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async printLabel() {
      document.activeElement && document.activeElement.blur()

      try {
        const url = this.current.label
        if (!url) return

        if (url.startsWith('http://') || url.startsWith('https://')) {
          window.open(url, '_blank')
        } else {
          print(url)
        }
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },

    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (
          this.current.id &&
          this.current.status == PACKAGE_WAREHOUSE_STATUS_PICK
        ) {
          return 'Đơn chưa được duyệt, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },

    reset() {
      ;(this.note = ''),
        (this.volume = { weight: 0, length: 0, width: 0, height: 0 })
    },
  },

  beforeRouteLeave(to, from, next) {
    if (
      this.current.id &&
      this.current.status == PACKAGE_WAREHOUSE_STATUS_PICK
    ) {
      const answer = window.confirm(
        'Đơn chưa được duyệt, bạn có muốn thoát khỏi page'
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
