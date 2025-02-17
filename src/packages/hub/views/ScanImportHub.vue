<template>
  <div class="pages import__hub">
    <div class="page-content">
      <div class="mb-24">
        <div class="row">
          <div class="col-4">
            <div class="card mb-16 card_input">
              <div class="card-body">
                <div class="">
                  <p-input
                    prefixIcon="search"
                    clearable
                    type="search"
                    class="mb-8"
                    :disabled="disableInput"
                    @clear="clearInput"
                    v-model="keyword"
                    placeholder="Nhập mã kiện/ups hoặc mã đơn/usps"
                  ></p-input>
                  <div class="d-flex">
                    <button
                      @click.prevent="searchHandle"
                      :disabled="disableBtnScan"
                      class="btn btn-scan-info mr-8 text-nowrap"
                      >Quét</button
                    >
                    <button
                      :disabled="!listContainer.length"
                      @click.prevent="acceptSubmit"
                      class="btn btn-scan-info text-nowrap"
                      >Xác nhận</button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-8">
            <div v-if="listContainer.length" class="card">
              <div class="card-header">
                <div class="card-title">Thông tin hàng nhập</div>
              </div>
              <div class="card-content">
                <template>
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                        <tr v-for="(item, i) in listContainer" :key="i">
                          <td width="200">{{ item.code }}</td>
                          <td>{{ item.type }}</td>
                          <td>
                            <a
                              href="#"
                              @click.prevent="handelModalConfirm(item)"
                            >
                              <p-svg name="x"></p-svg>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </div>
            </div>
            <div v-else class="card">
              <div class="card-header">
                <div class="card-title">Thông tin hàng nhập</div>
              </div>
              <EmptySearchResult></EmptySearchResult>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetchingContainer" />
    <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Xóa`"
      :cancel="`Bỏ qua`"
      :description="`Bạn có chắc chắn muốn xoá?`"
      :title="`Xác nhận`"
      @action="handleRemove"
      :type="`danger`"
    ></modal-confirm>
  </div>
</template>
<script>
import EmptySearchResult from '../components/Empty'
import mixinBarcode from '@core/mixins/barcode'
import { mapActions, mapState } from 'vuex'
import {
  GET_CONTAINER_IMPORT,
  FETCH_LIST_CONTAINER_IMPORTED,
  SCAN_CONTAINER_IMPORT,
  REMOVE_CONTAINER_IMPORT,
} from '../store'
import PageLoading from '@components/shared/OverLoading'
import mixinRoute from '@core/mixins/route'
import ModalConfirm from '@components/shared/modal/ModalConfirm'

export default {
  name: 'ImportHub',
  components: { PageLoading, EmptySearchResult, ModalConfirm },
  mixins: [mixinBarcode, mixinRoute],
  computed: {
    ...mapState('hub', {
      current: (state) => state.container,
      countPackage: (state) => state.countPackages,
      count: (state) => state.count,
      containers: (state) => state.containers,
    }),
    disableBtnScan() {
      return !this.keyword || this.isFetchingContainer || this.isScan
    },
  },
  data() {
    return {
      disableInput: false,
      keyword: '',
      isSubmitting: false,
      isCancel: false,
      isScan: false,
      listContainer: [],
      isFetchingContainer: false,
      visibleConfirm: false,
      visibleConfirmAccept: false,
      removeCode: {},
      current_code: '',
      currentType: '',
    }
  },
  created() {},
  mounted() {
    this.beforeLeaveHandle()
  },

  methods: {
    ...mapActions('hub', [
      GET_CONTAINER_IMPORT,
      FETCH_LIST_CONTAINER_IMPORTED,
      SCAN_CONTAINER_IMPORT,
      REMOVE_CONTAINER_IMPORT,
    ]),

    async searchHandle() {
      const keyword = this.keyword.trim()
      if (!keyword) {
        this.$toast.open({
          message: 'Mã nhập vào không để trống',
          type: 'error',
        })
        return
      }

      if (/\W|_/g.test(keyword)) {
        this.$toast.open({
          message: 'Mã nhập vào không đúng định dạng',
          type: 'error',
        })
        return
      }

      this.isScan = true
      this.isCancel = false
      const params = {
        code: keyword,
      }
      this.isFetchingContainer = true
      const res = await this[GET_CONTAINER_IMPORT](params)
      if (!res.success) {
        this.isFetchingContainer = false
        this.isScan = false
        this.isCancel = true
        this.$toast.open({
          type: 'error',
          message: `${res.message}`,
          duration: 3000,
        })
        return
      }
      this.isFetchingContainer = false
      this.filter.type = res.type
      if (this.filter.type == 'container') {
        this.current_code = this.current.code
        this.currentType = `Kiện hàng`
      } else if (this.filter.type == 'package') {
        this.current_code = this.current.package_code.code
        this.currentType = `Đơn hàng`
      }
      const index = this.listContainer.findIndex(
        (item) => item.code == this.current_code
      )
      if (index != -1) {
        this.$toast.open({
          type: 'error',
          message: `${this.currentType} đã tồn tại`,
          duration: 3000,
        })
        this.isScan = false
        this.isCancel = false
        return
      }
      this.listContainer.push({
        code: this.current_code,
        type: this.currentType,
        keyword: keyword,
        id: this.current.id,
      })
      this.keyword = ''
      this.isScan = false
      this.isCancel = false
    },
    handelModalConfirm(item) {
      this.visibleConfirm = true
      this.removeCode = item
    },
    barcodeSubmit(keyword) {
      this.disableInput = true
      if (keyword.length > 22) {
        keyword = keyword.slice(-22)
      }
      this.keyword = keyword
      this.searchHandle()
      this.disableInput = false
    },
    async acceptSubmit() {
      if (!this.listContainer.length || this.isSubmitting || this.isCancel)
        return
      let params = {
        containers: this.listContainer
          .filter((item) => item.type == `Kiện hàng`)
          .map((ele) => ele.id),
        packages: this.listContainer
          .filter((item) => item.type == `Đơn hàng`)
          .map((ele) => ele.id),
      }
      this.isSubmitting = true
      this.isFetchingContainer = true
      const res = await this[SCAN_CONTAINER_IMPORT](params)

      if (!res.success) {
        this.isFetchingContainer = false
        this.$toast.error(`Quét nhập thất bại`, { duration: 3000 })
        this.isSubmitting = false
        this.isScan = false
        return
      }
      this.isFetchingContainer = false

      this.isSubmitting = false
      this.isScan = false
      this.isCancel = true
      this.listContainer = []
      this.current_code = ''
      this.visibleConfirmAccept = false
      this.$toast.success(`Quét nhập  thành công`, { duration: 3000 })
    },
    clearInput() {
      this.keyword = ''
      this.isScan = false
      this.isCancel = false
    },
    async handleRemove() {
      // this.isSubmitting = true
      // const res = await this[REMOVE_CONTAINER_IMPORT](this.removeCode)
      // if (!res.success) {
      //   this.$toast.error(`Bỏ nhập thất bại`,{ duration: 3000 })
      //   this.isSubmitting = false
      //   return
      // }
      this.visibleConfirm = false
      this.listContainer = this.listContainer.filter(
        (element) => element != this.removeCode
      )
      this.keyword = ''
      this.isSubmitting = false
    },
    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (this.listContainer.length) {
          return 'Thông tin chưa được lưu, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.listContainer.length) {
      this.$confirm({
        title: `Xác nhận`,
        message: `Vui lòng xác nhận nhập hub trước khi thoát trang`,
        confirmText: `Xác nhận`,
        cancelText: `Bỏ qua`,
        type: `danger`,
        onConfirm: () => {
          this.acceptSubmit()
          next()
        },
        onCancel: () => {
          next()
        },
      })
      return
    }
    next()
  },
  watch: {},
}
</script>
