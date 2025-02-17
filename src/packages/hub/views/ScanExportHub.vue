<template>
  <div class="pages export__hub">
    <div class="page-content">
      <div class="mb-24">
        <div class="row">
          <div class="col-4">
            <div class="card mb-16">
              <div class="card-body">
                <div class="">
                  <div class="d-flex">
                    <p-input
                      prefixIcon="search"
                      clearable
                      class="mb-8"
                      type="search"
                      :disabled="disableInput"
                      v-model="keyword"
                      @clear="clearInput"
                      placeholder="Nhập mã kiện/ups, mã đơn/usps"
                    ></p-input>
                  </div>
                  <div class="d-flex">
                    <button
                      @click.prevent="searchHandle"
                      :disabled="disableBtnScan"
                      class="btn btn-scan-info text-nowrap mr-8"
                      >Quét</button
                    >
                    <button
                      :disabled="!listExported.length"
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
            <div v-if="listExported.length" class="card">
              <div class="card-header">
                <div class="card-title">Thông tin kiện hàng</div>
              </div>
              <div class="card-body">
                <template>
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                        <tr v-for="(item, i) in listExported" :key="i">
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
                <div class="card-title"> Thông tin hàng xuất</div>
              </div>
              <EmptySearchResult :type="`xuất`"></EmptySearchResult>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetchingImportHub" />
    <modal-confirm
      :visible.sync="visibleConfirmAccept"
      :actionConfirm="`Xác nhận`"
      :cancel="`Bỏ qua`"
      :description="`Vui lòng xác nhận xuất hub trước khi thoát trang`"
      :title="`Xác nhận xuất hub`"
      @action="acceptSubmit"
      :type="`danger`"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmRemove"
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
// import ExportHubTab from '../components/ExportHubTab.vue'
// import EmptySearchResult from '@components/shared/EmptySearchResult'
import EmptySearchResult from '../components/Empty'
import mixinBarcode from '@core/mixins/barcode'
import { mapActions, mapState } from 'vuex'
import {
  GET_IMPORT_HUB_DETAIL,
  FETCH_LIST_IMPORTED,
  SCAN_EXPORT_HUB,
} from '../store'
import PageLoading from '@components/shared/OverLoading'

import mixinRoute from '@core/mixins/route'
import ModalConfirm from '@components/shared/modal/ModalConfirm'

export default {
  name: 'ExportHub',
  components: { PageLoading, ModalConfirm, EmptySearchResult },
  mixins: [mixinBarcode, mixinRoute],
  computed: {
    ...mapState('hub', {
      current: (state) => state.importHubDetail,
      countPackage: (state) => state.countPackages,
      count: (state) => state.coutListImported,
      codes: (state) => state.listImported,
    }),

    disableBtnScan() {
      return !this.keyword || this.isFetchingImportHub || this.isScan
    },

    searchPlaceholder() {
      const maptext = {
        container: 'Nhập mã kiện/ups',
        package: 'Nhập mã đơn/ups',
      }

      return maptext[this.filter.type] || maptext['container']
    },
  },
  data() {
    return {
      disableInput: false,
      keyword: '',
      filter: {
        limit: 10,
        page: 1,
        type: 'container',
      },
      isFetchingImportHub: false,
      visibleConfirmAccept: false,
      currentCode: '',
      currentType: '',
      removeCode: {},
      visibleConfirm: false,
      visibleConfirmRemove: false,
      isSubmitting: false,
      listExported: [],
      isScan: false,
      searchBy: {
        container: 'Kiện hàng',
        package: 'Đơn hàng',
      },
      toRouter: '',
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.beforeLeaveHandle()
  },
  methods: {
    ...mapActions('hub', [
      GET_IMPORT_HUB_DETAIL,
      FETCH_LIST_IMPORTED,
      SCAN_EXPORT_HUB,
    ]),

    async searchHandle() {
      this.filter.page = 1
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

      this.handleUpdateRouteQuery()

      let params = {
        code: keyword,
        codes: {
          container_code: this.listExported
            .filter((item) => item.type == `Kiện hàng`)
            .map((ele) => ele.code),
          package_codes: this.listExported
            .filter((item) => item.type == `Đơn hàng`)
            .map((ele) => ele.code),
        },
      }
      this.isScan = true
      this.isFetchingImportHub = true
      const res = await this[GET_IMPORT_HUB_DETAIL](params)
      if (!res.success) {
        this.isFetchingImportHub = false
        this.isScan = false
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      this.isFetchingImportHub = false
      this.isScan = false
      this.filter.type = res.type
      this.keyword = ''
      if (this.filter.type == 'container') {
        this.currentCode = this.current.code
        this.currentType = `Kiện hàng`
      } else if (this.filter.type == 'package') {
        this.currentCode = this.current.package_code.code
        this.currentType = `Đơn hàng`
      }
      const index = this.listExported.findIndex(
        (item) => item.code == this.currentCode
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
      this.listExported.push({
        code: this.currentCode,
        type: this.currentType,
        id: this.current.id,
        keyword: keyword,
      })
    },

    async init() {
      this.isFetching = true
      // this.clearData()
      this.handleUpdateRouteQuery()
      // let payload = cloneDeep(this.filter)
      // const result = await this[FETCH_LIST_IMPORTED](payload)
      // this.isFetching = false
      // if (!result.success) {
      //   this.$toast.error(result.message)
      // }
    },

    clearData() {
      this.current_container.code = ''

      this.current_package.code = ''
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

    handelModalConfirm(code) {
      this.visibleConfirmRemove = true
      this.removeCode = code
    },
    async handleRemove() {
      this.visibleConfirmRemove = false
      this.listExported = this.listExported.filter(
        (element) => element != this.removeCode
      )
      this.keyword = ''
      this.isSubmitting = false
    },
    async acceptSubmit() {
      if (!this.currentCode || this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      this.isFetchingImportHub = true

      let payload = {
        containers: this.listExported
          .filter((item) => item.type == `Kiện hàng`)
          .map((ele) => ele.id),
        packages: this.listExported
          .filter((item) => item.type == `Đơn hàng`)
          .map((ele) => ele.id),
      }

      const res = await this[SCAN_EXPORT_HUB](payload)

      if (!res.success) {
        this.isFetchingImportHub = false
        this.isScan = false
        this.$toast.error(`Quét xuất  thất bại`, { duration: 3000 })
        this.isSubmitting = false
        return
      }
      this.isFetchingImportHub = false
      this.$toast.success(`Quét xuất  thành công`, { duration: 3000 })
      this.listExported = []
      this.isSubmitting = false
      this.isScan = false
      this.visibleConfirm = false
      this.visibleConfirmAccept = false
    },

    clearInput() {
      this.keyword = ''
      this.isScan = false
      this.currentCode = ''
    },
    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (this.listExported.length) {
          return 'Thông tin chưa được lưu, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.listExported.length) {
      this.$confirm({
        title: `Xác nhận`,
        message: `Vui lòng xác nhận xuất hub trước khi thoát trang`,
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
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
