<template>
  <div class="shipment-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-shipment' }" class="text">
            <span class="page-header_back_icon">
              <p-svg name="chevron-left"></p-svg>
            </span>
            <span>Lô hàng</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div class="info">
              <div>Mã lô:</div>
              <div class="package-code">{{ shipment.id }} </div>
            </div>
            <div class="info">
              <div>Ngày tạo: </div>
              <div>{{
                shipment.created_at | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
            <div class="info" v-if="manifest.length">
              <div>Manifest: </div>
              <div>
                <div class="navbar__header-manifest d-flex">
                  <div class="navbar__header-name">
                    <span class="mr-2">
                      <a
                        class="text-no-underline"
                        href="javascript:void(0)"
                        @click="downloadLabel(manifest[0].manifest_url)"
                        >{{ manifest[0].manifest_number }}</a
                      ></span
                    >
                    <a href="javascript:void(0)" @click="toogleMenuManifest">
                      <p-svg name="dropdown"></p-svg
                    ></a>
                  </div>
                  <div
                    class="dropdown-menu"
                    :class="{ active: showMenuManifest }"
                    v-click-outside="hideMenuManifest"
                  >
                    <div class="dropdown-content">
                      <div
                        class="dropdown-item"
                        v-for="(item, i) in manifest"
                        :key="i"
                      >
                        <a
                          class="text-no-underline"
                          href="javascript:void(0)"
                          @click="downloadLabel(item.manifest_url)"
                          >{{ item.manifest_number }}</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="info">
              <div>Trạng thái lô: </div>
              <div>
                <span v-status="shipment.status" type="shipment"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-header__subtitle row">
          <div class="page-header__info col-6">
            <p-input
              placeholder="Tìm theo mã kiện hàng"
              prefixIcon="search"
              type="search"
              v-model="code"
              @keyup.enter="handleSearch"
              v-if="!$isShipPartner() && !$isSaleOperation()"
            >
            </p-input>
            <p-button
              type="info"
              :class="'btn-add-container ml-3'"
              @click="handleAppendShipment"
              v-if="
                !isClosedShipment &&
                !isCanceledShipment &&
                !isDeliveredShipment &&
                !isIntransitShipment &&
                !$isShipPartner() &&
                !$isSaleOperation()
              "
            >
              <p-svg name="plus_blue"></p-svg>
              Thêm
            </p-button>
            <p-button
              type="info"
              v-if="
                !isClosedShipment &&
                !isCanceledShipment &&
                !isDeliveredShipment &&
                !isIntransitShipment &&
                !$isShipPartner() &&
                !$isSaleOperation()
              "
              :class="'btn-add-container ml-3'"
              @click="handleShowModalListContainer"
            >
              Danh sách
            </p-button>
          </div>
          <div
            class="page-header__action col-6 text-right"
            v-if="
              !isClosedShipment &&
              !isCanceledShipment &&
              !isDeliveredShipment &&
              !isIntransitShipment &&
              !$isShipPartner() &&
              !$isSaleOperation()
            "
          >
            <p-button
              type="info"
              class="mr-3"
              v-if="!isStartScan"
              @click.prevent="handleStartScan"
            >
              Bắt đầu quét
            </p-button>
            <button
              class="btn-info btn mr-3"
              v-else
              @click.prevent="handleStopScan"
              >Dừng quét</button
            >
            <p-button
              type="info"
              @click="handleButtonClose"
              :loading="loading"
              :class="`mr-3`"
            >
              Đóng lô hàng
            </p-button>
            <p-button
              type="danger"
              :class="`btn-cancel-shipment`"
              @click="handleCancelShipment"
            >
              Hủy lô hàng
            </p-button>
          </div>
          <div
            class="page-header__action col-6 text-right"
            v-if="
              isClosedShipment || isDeliveredShipment || isIntransitShipment
            "
          >
            <p-button
              type="info"
              v-if="
                showDownloadZipLabel && !$isShipPartner() && !$isSaleOperation()
              "
              @click="downloadZipLabel"
              :loading="loadingLabel"
              :class="`mr-3`"
            >
              Tải Label
            </p-button>
            <p-button
              type="info"
              v-if="
                showIntransitButton && !$isShipPartner() && !$isSaleOperation()
              "
              @click="showConfirmChangeIntransit"
              :loading="loading"
              :class="`mr-3`"
            >
              Chuyển UPS
            </p-button>
            <p-button
              type="info"
              @click="handleExport()"
              :class="`mr-3`"
              v-if="!$isSaleOperation()"
            >
              Xuất Excel
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
            <template v-else-if="containers.length">
              <div class="table-responsive">
                <table class="table table-hover" id="tbl-packages">
                  <thead>
                    <tr>
                      <th>Mã kiện hàng</th>
                      <th>Ngày tạo</th>
                      <th>Nhãn kiện hàng</th>
                      <th>Số lượng</th>
                      <th>Trọng lượng</th>
                      <th>Dài x Rộng x Cao</th>
                      <th>Loại</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in displayContainers" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'container-detail',
                            params: {
                              code: item.code,
                            },
                          }"
                        >
                          {{ item.code }}
                        </router-link>
                      </td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <a
                          class="text-no-underline mr-2"
                          v-if="item.tracking_number"
                          href="javascript:void(0)"
                          >{{ item.tracking_number }}</a
                        >

                        <span
                          class="svg"
                          v-if="item.tracking_number && !$isSaleOperation()"
                        >
                          <p-tooltip
                            v-if="
                              item.type == containerTypeApi ||
                              item.type == containerTypeFedEx
                            "
                            class="item_name"
                            :label="` Download `"
                            position="top"
                            type="dark"
                          >
                            <a
                              href="javascript:void(0)"
                              @click="downloadLabel(item.label_url)"
                            >
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="none" />
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M8.00002 19.264V12.728C8.00002 9.904 9.81682 8 12.528 8H19.464C22.176 8 24 9.904 24 12.728V19.264C24 22.096 22.176 24 19.464 24H12.528C9.81682 24 8.00002 22.096 8.00002 19.264ZM16.6 17.816V12.736C16.6 12.4 16.328 12.136 16 12.136C15.664 12.136 15.4 12.4 15.4 12.736V17.816L13.424 15.832C13.312 15.72 13.152 15.656 13 15.656C12.8488 15.656 12.696 15.72 12.576 15.832C12.344 16.064 12.344 16.448 12.576 16.68L15.576 19.696C15.8 19.92 16.2 19.92 16.424 19.696L19.424 16.68C19.656 16.448 19.656 16.064 19.424 15.832C19.184 15.6 18.808 15.6 18.568 15.832L16.6 17.816Z"
                                  fill="#313232"
                                />
                              </svg>
                            </a>
                          </p-tooltip>
                        </span>

                        <span
                          class="svg"
                          v-if="item.tracking_number && !$isSaleOperation()"
                        >
                          <p-tooltip
                            class="item_name"
                            :label="` Track `"
                            position="top"
                            type="dark"
                          >
                            <a
                              target="_blank"
                              :href="`https://www.ups.com/track?loc=vi_VN&tracknum=${item.tracking_number}&requester=WT/`"
                            >
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="none" />
                                <g clip-path="url(#clip0_382_4459)">
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.0682 18.9542L8.14707 17.6451C7.95102 17.5204 7.95102 17.3957 8.14707 17.2711L23.4723 8.04502C23.6356 7.95151 23.701 8.01385 23.7337 8.13853L23.9951 22.5074C24.0278 22.7568 23.8971 22.8815 23.6356 22.7568L18.2114 20.9802L16.4795 23.9101C16.4142 24.0347 16.2508 24.0347 16.2508 23.8789L15.7607 20.0763L21.7404 11.5671L14.8784 18.2373C14.1268 18.9542 13.2119 19.2035 12.0682 18.9542Z"
                                    fill="#313232"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_382_4459">
                                    <rect
                                      width="16"
                                      height="16"
                                      fill="white"
                                      transform="translate(8 8)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </p-tooltip>
                        </span>
                      </td>
                      <td>{{ item.count_items }}</td>
                      <td>{{ item.weight }}</td>
                      <td>
                        {{ getBoxInfo(item) }}
                      </td>
                      <td>{{ item.type_text }}</td>
                      <td>
                        <p-button
                          v-if="
                            !isClosedShipment &&
                            !isDeliveredShipment &&
                            !isIntransitShipment &&
                            !$isShipPartner() &&
                            !$isSaleOperation()
                          "
                          type="danger"
                          :class="`btn-cancel-container mr-3`"
                          @click="handleCancelContainer(item.id)"
                        >
                          Hủy
                        </p-button>
                        <p-button
                          type="info"
                          v-if="showBtnUpdate(item)"
                          @click="handleShowUpdateModal(item)"
                        >
                          Cập nhật tracking
                        </p-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mb-16"
                v-if="count > 0"
              >
                <p-pagination
                  :total="count"
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
    <modal-list-container
      :visible.sync="isShowModalListContainer"
      :shipment="shipment"
      :loading="loading"
      @save="handleAddContainer"
    >
    </modal-list-container>
    <modal-confirm
      :visible.sync="visibleConfirmIntransit"
      :type="`danger`"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn muốn chuyển UPS không?`"
      :title="`Xác nhận`"
      @action="handleChangeIntransit"
    >
    </modal-confirm>
    <modal-update-container
      :loading="isSubmitting"
      @update="handleUpdateContainer"
      :tracking="container.tracking_number"
      :visible.sync="visibleUpdateModal"
    >
    </modal-update-container>
    <modal-choice-account-ups
      :visible.sync="isShowModalAccount"
      :is-show-account="showModalAccount"
      :is-show-input-value="isShowInputValueShipment"
      @close="handleCloseShipment"
      :loading="loading"
    >
    </modal-choice-account-ups>
  </div>
</template>
<script>
import ModalUpdateContainer from '@/packages/container/components/ModalUpdateContainer'
import { CONTAINER_CLOSE } from '@/packages/container/contants'
import mixinDownload from '@/packages/shared/mixins/download'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import Browser from '@core/helpers/browser'
import mixinBarcode from '@core/mixins/barcode'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { PDFDocument } from 'pdf-lib'
import { mapActions, mapState } from 'vuex'
import * as XLSX from 'xlsx'
import { cloneDeep } from '../../../core/utils'
import {
  CONTAINER_TYPE_FEDEX,
  CONTAINER_TYPE_MANUAL,
  CONTAINER_TYPE_UPS,
} from '../../container/contants'
import { GET_LABEL, UPDATE_CONTAINER } from '../../container/store'
import ModalChoiceAccountUps from '../components/ModalChoiceAccountUps'
import ModalListContainer from '../components/ModalListContainer'
import {
  DEFAULT_ACCOUNT_UPS,
  MAP_NAME_STATUS_SHIPMENT,
  ShipmentCanceled,
  ShipmentClosed,
  ShipmentDelivered,
  ShipmentIntransit,
  ShipmentWaitingClose,
} from '../constants'
import {
  APPEND_CONTAINERS_SHIPMENT,
  APPEND_SHIPMENT,
  CANCEL_CONTAINER,
  CANCEL_SHIPMENT,
  CLOSE_SHIPMENT,
  DOWNLOAD_SHIPMENT_LABEL_ZIP,
  EXPORT_CUSTOMS_FORM,
  EXPORT_SHIPMENT,
  FETCH_SHIPMENT_DETAIL,
  INTRANSIT_SHIPMENT,
} from '../store'

export default {
  name: 'ShipmentDetail',
  mixins: [mixinRoute, mixinTable, mixinBarcode, mixinDownload],
  components: {
    EmptySearchResult,
    ModalListContainer,
    ModalConfirm,
    ModalUpdateContainer,
    ModalChoiceAccountUps,
  },
  data() {
    return {
      isFetching: false,
      filter: {
        limit: 30,
        page: 1,
        search: '',
      },
      showMenuManifest: false,
      code: '',
      isSubmitting: false,
      visibleUpdateModal: false,
      container: {},
      isStartScan: false,
      loading: false,
      loadingLabel: false,
      ShipmentClosed: ShipmentClosed,
      isShowModalListContainer: false,
      isShowModalAccount: false,
      visibleConfirmIntransit: false,
    }
  },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
      containers: (state) => state.containers,
      manifest: (state) => state.manifest,
      count: (state) => state.container_count,
      isCanceledShipment() {
        return this.shipment.status === ShipmentCanceled
      },
      isClosedShipment() {
        return this.shipment.status === ShipmentClosed
      },
      isDeliveredShipment() {
        return this.shipment.status === ShipmentDelivered
      },
      isIntransitShipment() {
        return this.shipment.status === ShipmentIntransit
      },
      shipmentStatus() {
        return MAP_NAME_STATUS_SHIPMENT
      },
      showDownloadZipLabel() {
        return (
          this.isClosedShipment ||
          this.isIntransitShipment ||
          this.isDeliveredShipment
        )
      },
      showIntransitButton() {
        return this.isClosedShipment
      },
      containerTypeUps() {
        return CONTAINER_TYPE_UPS
      },
      containerTypeFedEx() {
        return CONTAINER_TYPE_FEDEX
      },
      isShowInputValueShipment() {
        const containers = this.containers || []
        return (
          containers.filter((item) => item.type === CONTAINER_TYPE_FEDEX)
            .length > 0
        )
      },
      showModalAccount() {
        let isShow = false
        const containers = this.containers || []
        containers.map((item) => {
          if (item.type === CONTAINER_TYPE_UPS) {
            isShow = true
          }
        })
        return isShow
      },
      displayContainers() {
        return (this.containers || []).map((item) => {
          item.type_text =
            item.type == CONTAINER_TYPE_MANUAL
              ? 'Label Ngoài'
              : item.type == CONTAINER_TYPE_UPS
              ? 'Label UPS'
              : 'Label FedEx'
          return item
        })
      },
    }),
    items() {
      return this.containers
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('shipment', [
      FETCH_SHIPMENT_DETAIL,
      APPEND_SHIPMENT,
      APPEND_CONTAINERS_SHIPMENT,
      CANCEL_CONTAINER,
      CANCEL_SHIPMENT,
      CLOSE_SHIPMENT,
      INTRANSIT_SHIPMENT,
      EXPORT_SHIPMENT,
      EXPORT_CUSTOMS_FORM,
      DOWNLOAD_SHIPMENT_LABEL_ZIP,
    ]),
    ...mapActions('container', [GET_LABEL, UPDATE_CONTAINER]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      payload = { ...payload, ...{ id: parseInt(this.$route.params.id) } }
      const result = await this[FETCH_SHIPMENT_DETAIL](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    toogleMenuManifest() {
      this.showMenuManifest = !this.showMenuManifest
    },
    hideMenuManifest() {
      this.showMenuManifest = false
    },
    getBoxInfo(container) {
      return `${container.length} x ${container.width}  x ${container.height}`
    },
    showConfirmChangeIntransit() {
      this.visibleConfirmIntransit = true
    },
    async downloadLabel(labelUrl) {
      if (labelUrl == '') {
        this.$toast.open({
          type: 'error',
          message: "This tracking doesn't have label",
          duration: 3000,
        })
        return
      }
      let result = ''

      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this[GET_LABEL](payload)

      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
    async downloadZipLabel() {
      this.loadingLabel = true
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[DOWNLOAD_SHIPMENT_LABEL_ZIP](payload)
      this.loadingLabel = false
      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }
      this.mergeAllPDFs(result.url)
    },
    async mergeAllPDFs(urls) {
      const pdfDoc = await PDFDocument.create()
      const numDocs = urls.length
      for (var i = 0; i < numDocs; i++) {
        const payload = {
          url: urls[i],
          type: 'labels',
        }
        const res = await this[GET_LABEL](payload)
        if (!res.success) {
          this.$toast.open({ type: 'error', message: `Download failed ! ` })
          continue
        }
        const donorPdfBytes = await res.blob.arrayBuffer()
        const donorPdfDoc = await PDFDocument.load(donorPdfBytes)
        const docLength = donorPdfDoc.getPageCount()
        for (var k = 0; k < docLength; k++) {
          const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k])
          pdfDoc.addPage(donorPage)
        }
      }
      const pdfBytes = await pdfDoc.save()
      Browser.downloadBlob(
        new Blob([pdfBytes], { type: 'application/pdf' }),
        `shipment_${this.$route.params.id}.pdf`
      )
    },
    async downloadPdfLabel(labelUrl) {
      if (labelUrl == '') {
        this.$toast.open({
          type: 'error',
          message: "This tracking doesn't have label",
          duration: 3000,
        })
        return
      }
      let result = ''

      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this[GET_LABEL](payload)

      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
      return labelUrl.split('/').pop()
    },
    handleSearch(e) {
      this.filter.page = 1
      this.code = e.target.value.trim()
      this.$set(this.filter, 'search', this.code)
    },
    async handleAppendShipment() {
      this.code = this.code.trim()
      if (this.code == '') {
        this.$toast.open({
          message: `Nhập mã kiện hàng để thêm`,
          type: 'error',
        })
        return
      }
      const payload = {
        search: this.code,
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[APPEND_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm kiện hàng mã ${result.container.code} thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleCancelContainer(container_id) {
      const payload = {
        container_id: container_id,
        shipment_id: parseInt(this.$route.params.id),
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
      this.init()
    },
    async handleCancelShipment() {
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[CANCEL_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy lô hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleChangeIntransit() {
      this.visibleConfirmIntransit = false
      this.loading = true
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[INTRANSIT_SHIPMENT](payload)
      this.loading = false
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Chuyển UPS thành công`,
        type: 'success',
      })
      this.init()
    },
    handleButtonClose() {
      if (this.showModalAccount || this.isShowInputValueShipment) {
        this.isShowModalAccount = true
      } else {
        const payload = {
          ups_account: DEFAULT_ACCOUNT_UPS,
          shipment_value: 0,
        }
        this.handleCloseShipment(payload)
      }
    },
    async handleCloseShipment(payload) {
      this.loading = true
      payload.id = parseInt(this.$route.params.id)
      const result = await this[CLOSE_SHIPMENT](payload)
      this.isShowModalAccount = false
      this.loading = false
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Đóng lô hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    handleStartScan() {
      this.isStartScan = true
    },
    handleStopScan() {
      this.isStartScan = false
    },
    async barcodeSubmit(keyword) {
      if (!this.isStartScan) {
        this.$toast.error('Bạn phải nhấn bắt đầu quét trước khi quét.')
        return
      }
      const payload = {
        barcode: keyword.toUpperCase(),
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[APPEND_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm kiện hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleExport() {
      let item_id = this.$route.params.id
      const result = await this[EXPORT_SHIPMENT]({
        id: +item_id,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadFile(
        result.url,
        'packages',
        result.url.split('/'),
        'danh_sach_don_hang_'
      )
    },
    async handleExportCustomsForm() {
      let item_id = this.$route.params.id
      const result = await this[EXPORT_CUSTOMS_FORM]({
        id: +item_id,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      const fileName = `Shipment-${result.shipmentId}.xlsx`

      result.containers.forEach((container) => {
        const worksheet = this.createCustomsSheet(container)
        XLSX.utils.book_append_sheet(workbook, worksheet, container.code)
      })
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
    handleShowModalListContainer() {
      this.isShowModalListContainer = true
    },
    async handleAddContainer(ids) {
      this.loading = true
      const payload = {
        container_ids: ids,
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[APPEND_CONTAINERS_SHIPMENT](payload)
      this.loading = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm kiện hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    showBtnUpdate(container) {
      return (
        container.type === CONTAINER_TYPE_MANUAL &&
        [CONTAINER_CLOSE].includes(container.status) &&
        [ShipmentWaitingClose, ShipmentClosed].includes(this.shipment.status)
      )
    },
    handleShowUpdateModal(container) {
      this.visibleUpdateModal = true
      this.container = container
      document.onkeyup = null
      document.onkeydown = null
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
        id: parseInt(this.container.id),
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
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
    visibleUpdateModal: {
      handler: function (v) {
        if (!v) {
          this.initBarcodeListener()
        } else {
          this.destroyEvenListener()
        }
      },
    },
  },
}
</script>
<style>
.shipment-detail .navbar__header-name {
  cursor: pointer;
}
.shipment-detail .dropdown-menu.active {
  display: block !important;
}
.shipment-detail .navbar__header-manifest .dropdown-menu {
  right: -5px;
  left: unset;
  top: 24px;
  background: #f6f7f7;
  box-shadow: 0px 0px 2px rgb(40 41 61 / 4%), 0px 4px 8px rgb(96 97 112 / 16%);
  border-radius: 0px;
  border: none;
}
.shipment-detail .navbar__header-manifest .dropdown-menu .dropdown-item {
  font-size: 16px;
  font-weight: 600;
}
.navbar__header-manifest {
  position: relative;
}
.shipment-detail .btn-add-container {
  background-color: #dff6f7;
  color: #00b4c3;
  white-space: nowrap;
  border: none;
}

.shipment-detail .page-header_back {
  margin-bottom: 16px;
}

.shipment-detail .page-header_back a {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.2px;
  color: #626363;
}

.shipment-detail .page-header_back a img {
  margin-top: -2px;
}

.shipment-detail .page-header_back a span {
  margin-left: 10px;
}

.shipment-detail .page-header {
  margin-bottom: 18px;
}

.shipment-detail .btn-add-container img {
  margin-top: -6px;
}

.shipment-detail .page-header__info {
  display: flex;
}

.shipment-detail .page-header__info .input-group {
  width: calc(100% - 195px);
}

.shipment-detail .btn-cancel-container {
  padding: 6px 16px;
  background-color: #fff1f0;
  border: none;
  color: red;
  border-radius: 4px;
}

.shipment-detail .btn-cancel-shipment {
  border: 1px solid #f5222d;
  color: red;
  background-color: #fff;
}

.page-header__info > .info {
  margin-right: 50px;
}

.page-header__info > div div:last-child {
  font-size: 16px;
  font-weight: 600;
}

.page-header__subtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

#tbl-packages svg {
  margin-top: 0;
}

#tbl-packages .svg {
  opacity: 0;
}

#tbl-packages tr:hover .svg {
  opacity: 1;
}

#tbl-packages tr:hover .svg svg:hover circle {
  fill: #e1f7fc;
}

#tbl-packages tr:hover .svg svg:hover path {
  fill: #20bddb;
}

#tbl-packages .p-tooltip::after {
  width: auto;
}
</style>
