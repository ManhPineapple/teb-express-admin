<template>
  <div class="container-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-container' }" class="text">
            <span class="page-header_back_icon">
              <p-svg name="chevron-left"></p-svg>
            </span>
            <span>Danh sách kiện hàng</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div>
              <div>Mã kiện:</div>
              <div class="package-code"
                >{{ container_detail.code ? container_detail.code : '' }}
                <span
                  class="page-header__barcode"
                  style="vertical-align: bottom"
                  @click="printBarcode"
                >
                  <p-svg name="barcode"></p-svg>
                </span>
              </div>
            </div>
            <div>
              <div>Ngày tạo: </div>
              <div>{{
                container_detail.created_at | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
            <div>
              <div>Trạng thái kiện: </div>
              <div
                ><span
                  v-status="container_detail.status"
                  type="container"
                ></span
              ></div>
            </div>
            <div>
              <div>Số lượng đơn: </div>
              <div>{{ count }}</div>
            </div>
            <div>
              <div>Loại kiện hàng: </div>
              <div>{{ typeText }}</div>
            </div>
          </div>
          <div>
            <p-checkbox class="filter-checkbox" v-model="filter.isFail"
              >Chỉ hiển thị đơn lỗi</p-checkbox
            >
          </div>
        </div>

        <div
          class="page-header__subtitle row"
          v-if="!$isShipPartner() && !$isSaleOperation()"
        >
          <div class="page-header__input col-6">
            <p-input
              placeholder="Tìm theo AnanBay tracking"
              prefixIcon="search"
              type="search"
              v-model="code"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button
              type="info"
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              :class="'btn-add-container ml-3'"
              @click="handleAppend"
            >
              <p-svg name="plus_blue"></p-svg>
              Thêm
            </p-button>
          </div>
          <div class="page-header__action col-6 text-right">
            <p-button
              type="info"
              :class="`mr-3`"
              v-if="showBtnUpdate"
              @click="handleShowUpdateModal"
            >
              Cập nhật tracking
            </p-button>
            <p-button
              id="startScanButton"
              type="info"
              :class="`mr-3`"
              v-if="
                !isStartScan &&
                container_detail.status === CONTAINER_WAITING_CLOSE
              "
              @click="handleStartScan"
            >
              Bắt đầu quét
            </p-button>
            <p-button
              id="stopScanButton"
              v-if="
                isStartScan &&
                container_detail.status === CONTAINER_WAITING_CLOSE
              "
              @click="handleStopScan"
              type="info"
              :class="`mr-3`"
              >Dừng quét</p-button
            >
            <p-button
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              type="info"
              @click="showModalClose"
              :class="`mr-3`"
            >
              Đóng kiện hàng
            </p-button>
            <p-button
              v-if="container_detail.status === containerClose"
              type="info"
              @click="confirmOpenContainer"
              :class="`mr-3`"
            >
              Mở kiện hàng
            </p-button>
            <p-button
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              type="danger"
              :class="`btn-cancel-shipment`"
              @click="handelModal"
            >
              Hủy kiện hàng
            </p-button>
            <p-button
              type="info"
              @click="handleExportCustomsForm()"
              :class="`mr-3`"
              v-if="!$isSaleOperation()"
            >
              <!-- modify accessable role -->
              Báo cáo Hải Quan
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="packages_in_container">
              <div class="table-responsive">
                <table class="table table-hover" id="tbl-packages">
                  <thead>
                    <tr>
                      <th>AnanBay tracking</th>
                      <th>Ngày tạo</th>
                      <th>Nhãn đơn hàng</th>
                      <th>Trọng lượng</th>
                      <th>Dài x Rộng x Cao</th>
                      <th>Trạng thái quét</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in items" :key="i">
                      <td>
                        <router-link
                          v-if="isAdmin || $isWarehouse"
                          class="text-no-underline"
                          :to="`/packages/${item.id}`"
                        >
                          {{ `${item.code} (${item.order_number})` }}
                        </router-link>
                        <span v-else>{{ item.code }}</span>
                      </td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <a
                          class="text-no-underline"
                          v-if="item.tracking"
                          href="javascript:void(0)"
                          @click="downloadLabel(item.tracking.label_url)"
                          >{{ item.tracking.tracking_number }}</a
                        >
                      </td>
                      <td>
                        <span>{{ item.actual_weight || item.weight }}</span>
                      </td>
                      <td>
                        {{ getBoxInfo(item) }}
                      </td>
                      <td>
                        <ItemStatus :current="item" />
                      </td>
                      <td>
                        <p-button
                          v-if="
                            container_detail.status ===
                              CONTAINER_WAITING_CLOSE && !$isSaleOperation()
                          "
                          type="danger"
                          :class="`btn-cancel-container`"
                          @click="handlerRemovePackage(item.id)"
                        >
                          Hủy
                        </p-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mb-16"
                v-if="count_item > 0"
              >
                <p-pagination
                  :total="count_item"
                  :perPage.sync="filter.limit"
                  :current.sync="filter.page"
                  size="sm"
                >
                </p-pagination>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="visibleConfirm"
      :type="`danger`"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn hủy kiện ?`"
      :title="`Xác nhận hủy`"
      @action="handleCancelContainer"
    >
    </modal-confirm>
    <modal-choice-shipping-box
      :boxes="boxes"
      @save="handlerClose"
      :visible.sync="visibleModalClose"
      :cancel="`Hủy`"
      :actionConfirm="`Xác nhận`"
      :title="'Xác nhận đóng kiện'"
      :typeContainer="container_detail.type"
    >
    </modal-choice-shipping-box>
    <modal-update-container
      :loading="isSubmitting"
      @update="handleUpdateContainer"
      :tracking="container_detail.tracking_number"
      :visible.sync="visibleUpdateModal"
    >
    </modal-update-container>
  </div>
</template>

<script>
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import mixinBarcode from '@core/mixins/barcode'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import * as XLSX from 'xlsx'
import {
  APPEND_PACKAGE_TO_CONTAINER,
  CANCEL_CONTAINER,
  CLOSE_CONTAINER,
  FETCH_CONTAINER_DETAIL,
  GET_LABEL,
  OPEN_CONTAINER,
  REMOVE_PACKAGE_FROM_CONTAINER,
  UPDATE_CONTAINER,
} from '../store'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import Browser from '@core/helpers/browser'
import { printImage } from '@core/utils/print'
import { cloneDeep } from '../../../core/utils'
import api from '../api'
import ItemStatus from '../components/ItemStatus'
import ModalChoiceShippingBox from '../components/ModalChoiceShippingBox'
import ModalUpdateContainer from '../components/ModalUpdateContainer'
import {
  CONTAINER_CLOSE,
  CONTAINER_TYPE_API,
  CONTAINER_TYPE_MANUAL,
  CONTAINER_WAITING_CLOSE,
} from '../contants'

export default {
  name: 'ContainerDetail',
  mixins: [mixinRoute, mixinTable, mixinBarcode],
  components: {
    EmptySearchResult,
    ModalConfirm,
    ModalChoiceShippingBox,
    ModalUpdateContainer,
    ItemStatus,
  },
  data() {
    return {
      isFetching: false,
      filter: {
        limit: 30,
        page: 1,
        search: '',
        isFail: false,
      },
      isSubmitting: false,
      visibleConfirm: false,
      visibleUpdateModal: false,
      code: '',
      isStartScan: false,
      containerClose: CONTAINER_CLOSE,
      CONTAINER_WAITING_CLOSE: CONTAINER_WAITING_CLOSE,
      visibleModalClose: false,
    }
  },
  computed: {
    ...mapState('container', {
      container_detail: (state) => state.container_detail,
      packages_in_container: (state) => state.packages_in_container,
      count: (state) => state.count_packages_in_container,
      count_item: (state) => state.count_item,
      boxes: (state) => state.boxes,
      filterPage: (state) => state.filter.page,
    }),
    items() {
      return this.packages_in_container.map((item) => {
        item.code = item.package_code ? item.package_code.code : ''
        return item
      })
    },
    showBtnUpdate() {
      return (
        (this.container_detail || {}).type === CONTAINER_TYPE_MANUAL &&
        [CONTAINER_CLOSE].includes((this.container_detail || {}).status)
      )
    },
    isAdmin() {
      return this.$isAdmin()
    },
    typeText() {
      const containerType = (this.container_detail || {}).type
      return containerType == CONTAINER_TYPE_MANUAL
        ? 'Label Ngoài'
        : containerType == CONTAINER_TYPE_API
        ? 'Label Ananbay'
        : 'Label FedEx'
    },
  },
  created() {
    this.filter.page = this.filterPage
    this.init()
  },
  methods: {
    ...mapActions('container', [
      FETCH_CONTAINER_DETAIL,
      APPEND_PACKAGE_TO_CONTAINER,
      REMOVE_PACKAGE_FROM_CONTAINER,
      CLOSE_CONTAINER,
      CANCEL_CONTAINER,
      GET_LABEL,
      UPDATE_CONTAINER,
      OPEN_CONTAINER,
      'updateFilterPage',
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.filter.search = this.code
      let payload = cloneDeep(this.filter)
      payload = { ...payload, ...{ code: this.$route.params.code } }
      const result = await this[FETCH_CONTAINER_DETAIL](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    getBoxInfo(pkg) {
      const length = pkg.actual_length || pkg.length
      const width = pkg.actual_width || pkg.width
      const height = pkg.actual_height || pkg.height
      return `${length} x ${width}  x ${height}`
    },
    async handleAppend() {
      this.code = this.code.trim()
      if (this.code === '') {
        this.$toast.open({
          message: `Nhập AnanBay tracking để thêm`,
          type: 'error',
        })
        return
      }
      const payload = {
        search: this.code,
        container_id: +this.container_detail.id,
      }
      const result = await this[APPEND_PACKAGE_TO_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      // this.$toast.open({
      //   message: `Thêm đơn hàng thành công`,
      //   type: 'success',
      // })
      this.code = ''
      await this.init()
    },
    async handlerRemovePackage(package_id) {
      const payload = {
        container_id: parseInt(this.container_detail.id),
        package_ids: [package_id],
      }
      const result = await this[REMOVE_PACKAGE_FROM_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy đơn hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    async handleUpdateContainer(tracking) {
      const regex = /^[a-z0-9]+$/i
      if (tracking.trim() != '' && !regex.test(tracking.trim())) {
        this.$toast.open({
          message: 'Tracking chỉ chứa chữ số và chữ cái',
          type: 'error',
        })
        return
      }
      this.isSubmitting = true
      const payload = {
        id: parseInt(this.container_detail.id),
        tracking_number: tracking.trim().toUpperCase(),
      }
      const result = await this[UPDATE_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.isSubmitting = false
      this.visibleUpdateModal = false
      this.$toast.open({
        message: `Cập nhật kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    async handleCancelContainer() {
      this.visibleConfirm = false
      const payload = {
        id: parseInt(this.container_detail.id),
      }
      const result = await this[CANCEL_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
    },

    showModalClose() {
      this.visibleModalClose = true
    },
    async handlerClose(body) {
      if (body.weight <= 0) {
        this.$toast.open({
          message: 'Trọng lượng phải lớn hơn 0',
          type: 'error',
        })
        return
      }
      this.visibleModalClose = false

      const payload = Object.assign(
        { id: parseInt(this.container_detail.id) },
        body
      )
      const result = await this[CLOSE_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Đóng kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    confirmOpenContainer() {
      this.$dialog.confirm({
        title: 'Mở kiện hàng',
        message: 'Bạn thực sự muốn mở kiện hàng này ?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        onConfirm: () => this.openContainerHandle(),
      })
    },
    async openContainerHandle() {
      const payload = { id: parseInt(this.container_detail.id) }
      const result = await this[OPEN_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: 'Mở kiện thành công',
        type: 'success',
      })
      this.init()
    },
    handleStartScan() {
      this.isStartScan = true
      document.getElementById('startScanButton').blur()
    },
    handleShowUpdateModal() {
      this.visibleUpdateModal = true
      this.destroyEvenListener()
    },
    handleStopScan() {
      this.isStartScan = false
      document.getElementById('stopScanButton').blur()
    },
    async barcodeSubmit(keyword) {
      if (this.visibleModalClose) return
      if (!this.isStartScan) {
        this.$toast.error('Bạn phải nhấn bắt đầu quét trước khi quét.')
        return
      }

      if (keyword.length == 38) {
        keyword = keyword.slice(-26).trim()
      } else if (keyword.length > 40) {
        keyword = keyword.slice(-23).trim()
      } else if (keyword.length > 24) {
        keyword = keyword.slice(-22).trim()
      }

      const payload = {
        tracking_number: keyword,
        container_id: +this.container_detail.id,
      }
      const result = await this[APPEND_PACKAGE_TO_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      // this.$toast.open({
      //   message: `Thêm đơn hàng thành công`,
      //   type: 'success',
      // })
      this.code = ''
      this.init()
    },
    async printBarcode() {
      document.activeElement && document.activeElement.blur()

      const res = await api.downloadLabel({
        url: this.container_detail.barcode,
        type: 'labels',
      })
      if (!res && res.error) {
        this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
        return
      }

      try {
        let blob = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(blob)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    async downloadLabel(labelUrl) {
      if (this.$isSaleOperation()) {
        return
      }
      if (labelUrl === '') {
        this.$toast.open({
          type: 'error',
          message: 'Đơn không có tracking',
          duration: 3000,
        })
        return
      }

      let result = ''
      this.isFetching = true
      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this.getLabel(payload)
      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      this.isFetching = false

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
    async handleExportCustomsForm() {
      const payload = {
        page: 1,
        limit: 250,
        code: this.$route.params.code,
      }
      const result = await this[FETCH_CONTAINER_DETAIL](payload)

      const maxPage = Math.ceil(result.count_item / 250)
      if (maxPage > 1) {
        const pageRequests = Array.from({ length: maxPage - 1 }, (_, i) =>
          this[FETCH_CONTAINER_DETAIL]({
            page: i + 2,
            limit: 250,
            code: this.$route.params.code,
          })
        )

        const moreResults = await Promise.all(pageRequests)
        result.packages = result.packages.concat(
          ...moreResults.map((r) => r.packages)
        )
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      const fileName = `Container-${this.$route.params.code}.xlsx`

      const worksheet = this.createCustomsSheet(result)
      XLSX.utils.book_append_sheet(workbook, worksheet, this.$route.params.code)
      XLSX.writeFile(workbook, fileName)
    },
    createCustomsSheet(container) {
      const headers = [
        'ShipperCity',
        'ShipperPostalCode',
        'ShipperStateProvinceCode',
        'ShipperCountry',
        'ConsigneeName',
        'ConsigneeAddress1',
        'ConsigneeAddress2',
        'ConsigneeCity',
        'ConsigneeStateCode',
        'ConsigneePostalCode',
        'ConsigneeCountry',
        'HAWBPieceCount',
        'HAWBWeight',
        'PIECEUOM',
        'HAWBDescription',
        'ProductDetails',
        'CountryOfOrigin',
        'HAWBValue',
        'CurrencyCode',
        'HAWBTrackingNumber',
        'PIN',
      ]

      const sheetData = [headers]
      container.packages.forEach((pkg) => {
        const rowData = [
          'Thanh Xuan',
          '100000',
          'Ha Noi',
          'VN',
          pkg.recipient || '',
          pkg.address_1 || '',
          pkg.address_2 || '',
          pkg.city || '',
          pkg.state_code || '',
          pkg.zipcode || '',
          pkg.country_code || '',
          pkg.package_quantity || '',
          pkg.tracking.weight || '',
          '',
          pkg.package_name,
          pkg.detail,
          'VN',
          pkg.product_price || '',
          'USD',
          pkg.tracking.tracking_number || '',
          '',
        ]
        sheetData.push(rowData)
      })

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
      const colWidths = headers.map((header, colIndex) => {
        const maxLength = sheetData.reduce((max, row) => {
          const cellValue =
            row[colIndex] !== undefined ? row[colIndex].toString() : ''
          return Math.max(max, cellValue.length)
        }, header.length)
        return { wch: maxLength + 2 }
      })
      worksheet['!cols'] = colWidths

      return worksheet
    },
    handleSearch(e) {
      this.filter.page = 1
      this.code = e.target.value.trim()
      this.$set(this.filter, 'search', this.code)
    },
    handelModal() {
      this.visibleConfirm = true
    },
    changePage(newPage) {
      this.updateFilterPage(newPage)
      this.filter.page = newPage
    },
  },
  watch: {
    filter: {
      handler: function (newFilter) {
        this.changePage(newFilter.page)
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.container-detail .btn-add-container {
  background-color: #dff6f7;
  color: #00b4c3;
  white-space: nowrap;
  border: none;
}

.btn-add-container {
  svg {
    margin-bottom: 3px;
  }
}

.container-detail .page-header_back {
  margin-bottom: 16px;
}

.container-detail .page-header_back a {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.2px;
  color: #626363;
}

.container-detail .page-header_back a img {
  margin-top: -2px;
}

.container-detail .page-header_back a span {
  margin-left: 10px;
}

.container-detail .page-header {
  margin-bottom: 18px;
}

.container-detail .btn-add-container img {
  margin-top: -6px;
}

.container-detail .page-header__info {
  display: flex;
}

.page-header__input {
  display: flex;
}

.container-detail .page-header__input .input-group {
  width: calc(100% - 100px) !important;
}

.container-detail .btn-cancel-container {
  padding: 6px 16px;
  background-color: #fff1f0;
  border: none;
  color: red;
  border-radius: 4px;
}

.container-detail .btn-cancel-shipment {
  border: 1px solid #f5222d;
  color: red;
  background-color: #fff;
}

.page-header__subtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.page-header__info {
  display: flex;
  //margin-left: 34px;
}

.container-detail .page-header__info > {
  div {
    margin-right: 50px;

    div:last-child {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.page-header__barcode img {
  cursor: pointer;
}

.filter-checkbox {
  position: relative !important;
  left: 0 !important;
}

.filter-checkbox.checkbox-custom label {
  padding-left: 6px;
}
</style>
