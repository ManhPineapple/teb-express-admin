<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <div class="group d-flex">
          <p-input
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            :clearable="true"
            v-model="keywordSearch"
            @input="checkClearSearch"
            @keyup.enter="handleSearch"
            @clear="clearSearch"
          >
          </p-input>
          <p-select
            style="
              width: auto;
              border-top-left-radius: unset !important;
              border-bottom-left-radius: unset !important;
              border-left: unset;
            "
            placeholder="Please select"
            v-model="filter.search_by"
          >
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
          <p-select
            style="
              width: auto;
              border-top-left-radius: unset !important;
              border-bottom-left-radius: unset !important;
              border-left: unset;
            "
            placeholder="Please select"
            v-model="filter.service"
          >
            <option :value="key" v-for="(value, key) in serviceCode" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>

        <div class="d-flex date-search">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            :label="labelDate"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
        <div class="ml-8" style="min-width: 270px">
          <p-select
            style="width: 100%"
            :placeholder="`Tìm theo kho`"
            v-model="filter.warehouse_id"
          >
            <option
              :value="item.id"
              v-for="(item, key) in wareHouses"
              :key="key"
            >
              {{ item.name }}
            </option>
          </p-select>
        </div>
        <div class="ml-8 text-right" v-if="isShowButton">
          <p-button
            type="info"
            class="btn-create-noti mr-8"
            @click="showFormUpload"
          >
            Import
          </p-button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <package-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="packages.length">
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover table-packages" id="tbl-packages">
                <thead>
                  <div
                    class="bulk-actions d-flex align-items-center"
                    v-if="totalSelected > 0"
                  >
                    <div class="bulk-actions__main-bar">
                      <span class="bulk-actions__selection-count">{{
                        selectionCountText
                      }}</span>
                      <p-button
                        class="bulk-actions__selection-status"
                        @click="handleExport"
                        >Xuất Excel</p-button
                      >
                      <p-button
                        class="bulk-actions__selection-status"
                        @click="isVisibleModalExtraFee = true"
                        >Tạo phí phát sinh</p-button
                      >
                      <!-- <p-button
                        class="bulk-actions__selection-status"
                        @click="handleOcrTiktok"
                        >Quét thông tin người nhận</p-button
                      > -->
                      <p-button
                        type="info"
                        class="bulk-actions__selection-status"
                        @click="downloadBarcode"
                      >
                        Tải xuống mã vạch AB
                      </p-button>
                      <p-button
                        class="bulk-actions__selection-status"
                        @click="handlerDownloadLabels"
                        >Tải xuống nhãn</p-button
                      >
                    </div>
                  </div>
                  <tr>
                    <th width="40">
                      <p-checkbox
                        class="order-select-checkbox"
                        :class="{ checkAll: totalSelected > 0 }"
                        :style="totalSelected > 0 && { width: 0 }"
                        :value="isAllChecked"
                        @change.native="toggleSelectAll"
                        :indeterminate="isIndeterminate"
                      ></p-checkbox>
                    </th>
                    <template>
                      <th :class="{ hidden: hiddenClass }">order no.</th>
                      <th
                        width="60"
                        class="text-center"
                        :class="{ hidden: hiddenClass }"
                      >
                        <img
                          src="img/tiktok-icon.svg"
                          alt="TikTok"
                          class="icon-tiktok"
                          width="20"
                          height="20"
                        />
                        <p-checkbox
                          :value="filter.has_tiktok_label"
                          @input="toggleHasTiktokLabel"
                          class="ml-5 mt-1"
                        ></p-checkbox>
                      </th>

                      <th
                        width="60"
                        class="text-center d-flex align-items-center justify-content-center"
                        :class="{ hidden: hiddenClass }"
                      >
                        <img
                          src="img/fast.svg"
                          alt="early_scan"
                          class="icon-fast"
                          width="25"
                          height="25"
                        />
                        <p-checkbox
                          :value="filter.is_early_scan"
                          @input="toggleIsEarlyScan"
                          class="ml-5 mt-1"
                        ></p-checkbox>
                      </th>

                      <th :class="{ hidden: hiddenClass }">ananbay tracking</th>
                      <th :class="{ hidden: hiddenClass }"
                        >last mile tracking</th
                      >
                      <th :class="{ hidden: hiddenClass }">customer</th>
                      <th :class="{ hidden: hiddenClass }" class="text-center"
                        >kho</th
                      >
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >created date
                      </th>
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >scan weight date
                      </th>
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >label print date
                      </th>
                      <th width="150" :class="{ hidden: hiddenClass }"
                        >status</th
                      >
                      <th :class="{ hidden: hiddenClass }">Total fee</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in filteredPackages"
                    :key="i"
                    :class="{
                      hover: isChecked(item),
                      deactive:
                        (item.package_code &&
                          item.package_code.status ==
                            PackageStatusDeactivate) ||
                        item.status_string == PackageStatusExpiredText,
                    }"
                  >
                    <td width="40">
                      <p-checkbox
                        v-model="action.selected"
                        :native-value="item"
                        @input="handleValue($event)"
                      >
                      </p-checkbox>
                    </td>
                    <td class="order-number">
                      <div class="d-flex justify-content-between">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                        >
                          {{ item.order_number }}
                        </router-link>
                        <span
                          v-if="!item.validate_address"
                          class="list-warning pull-right badge badge-round badge-warning-order"
                          @click="showModalAddress(item)"
                        >
                          <p-tooltip
                            class="item_name"
                            :label="`Địa chỉ không hợp lệ`"
                            position="top"
                            type="dark"
                          >
                            <p-svg name="location-warning"></p-svg>
                          </p-tooltip>
                        </span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span
                        v-if="
                          item.service.code === 'T' ||
                          item.custom_tiktok_barcode
                        "
                      >
                        <img
                          src="img/tiktok-icon.svg"
                          alt="TikTok"
                          class="icon-tiktok"
                          width="20"
                          height="20"
                        />
                      </span>
                    </td>
                    <td></td>
                    <td class="text-nowrap code">
                      <span v-if="showPackageCode(item)" class="link-code">
                        {{ item.package_code.code }}
                      </span>
                      <span
                        v-else
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                      >
                        N/A
                      </span>
                      <span
                        class="svg"
                        v-if="
                          showPackageCode(item) && item.country_code != 'AU'
                        "
                      >
                        <p-tooltip
                          class="item_name"
                          :label="` Track `"
                          position="top"
                          type="dark"
                        >
                          <a
                            target="_blank"
                            :href="`https://t.17track.net/en#nums=${
                              item.package_code ? item.package_code.code : ''
                            }`"
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
                    <td class="text-nowrap">
                      <track-link v-if="item.tracking" :current="item" />
                      <span
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                        v-else
                        >N/A</span
                      >
                    </td>
                    <td>
                      {{ item.user.full_name }}
                    </td>
                    <td class="text-center">
                      {{ item.warehouse ? item.warehouse.name : '-' }}
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ item.scan_weight_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ item.last_print_label_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <span v-status="item.status"></span>
                      <span
                        v-if="item.alert > 0"
                        class="pull-right list-warning badge badge-round badge-warning-order"
                      >
                        <p-tooltip
                          class="item_name"
                          :label="description(item.alert)"
                          position="top"
                          type="dark"
                        >
                          <p-svg name="warning"></p-svg>
                        </p-tooltip>
                      </span>
                    </td>
                    <td
                      class="fee"
                      v-if="item.is_package_exceed"
                      style="color: #fa8c16"
                    >
                      <span v-if="!item.shipping_fee"> Đang tính giá </span>
                      <p-tooltip
                        :label="`Hàng quá cỡ`"
                        position="top"
                        type="dark"
                        v-else
                      >
                        <span class="pkg-exceed">
                          {{ convertPrice(item) | formatPrice }}
                        </span>
                      </p-tooltip>
                    </td>
                    <td v-if="item.service.code == 'CN'">{{
                      convertPrice(item) | formatPriceCN
                    }}</td>
                    <td v-else>{{ convertPrice(item) | formatPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
              v-if="count > 0"
            >
              <!-- Centered limit selector -->
              <div class="limit-selector">
                <span class="label">Hiển thị</span>
                <select
                  v-model.number="filter.limit"
                  class="form-control form-control-sm"
                >
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                  <option :value="200">200</option>
                </select>
              </div>

              <!-- Right-aligned pagination -->
              <p-pagination
                :total="count"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              />
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-export :visible="isVisibleExport"> </modal-export>
    <modal-import
      :visible.sync="visibleModalImport"
      :loading="isUploading"
      @selected="importTrackingHandle"
    ></modal-import>
    <modal-confirm-address
      :visible.sync="isVisibleComfirmAdress"
      :pkg="comfirmAddressPkg"
      @confirm="handleConfirmAddress"
    />
    <modal-create-extra-fee
      :visible.sync="isVisibleModalExtraFee"
      :loading="isSubmitting"
      @save="handleSubmitExtraFee"
    ></modal-create-extra-fee>
    <OverLoading :is-loading="isSubmitting" />
  </div>
</template>
<script>
import ModalImport from '@/components/shared/modal/ModalImport'
import mixinDownload from '@/packages/shared/mixins/download'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import OverLoading from '@components/shared/OverLoading'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { truncate } from '@core/utils/string'
import JsBarcode from 'jsbarcode'
import jsPDF from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import { mapActions, mapState } from 'vuex'
import { CREATE_EXTRA_FEE } from '../../bill/store/index'
import { FETCH_WAREHOUSE } from '../../shared/store'
import api from '../api'
import ModalConfirmAddress from '../components/ModalConfirmAddress.vue'
import ModalCreateExtraFee from '../components/ModalCreateExtraFee'
import ModalExport from '../components/ModalExport'
import PackageStatusTab from '../components/PackageStatusTab'
import TrackLink from '../components/TrackLink.vue'
import {
  MAP_NAME_STATUS_STRING_PACKAGE,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
  PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT,
  PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN,
  PACKAGE_CODE_TEMP,
  PACKAGE_STATUS_ARCHIVED,
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_DEACTIVATE,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_STATUS_TAB,
} from '../constants'
import {
  CANCEL_PACKAGES,
  CONFIRM_ADDRESS,
  COUNT_LIST_PACKAGES,
  EXPORT_PACKAGE,
  EXPORT_PACKAGE_AU,
  FETCH_LIST_PACKAGES,
  IMPORT_PACKAGE,
  IMPORT_TRACKING,
  OCR_TIKTOK_LABEL,
  PROCESS_PACKAGE,
} from '../store'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    PackageStatusTab,
    ModalExport,
    TrackLink,
    ModalImport,
    ModalConfirmAddress,
    ModalCreateExtraFee,
    OverLoading,
  },
  props: {
    user_id: {
      type: Number,
      default: 0,
    },
    searchBy: {
      type: Object,
      default() {
        return {
          code: 'AnanBay tracking',
          order_number: 'Mã đơn hàng',
          recipient: 'Người nhận',
          account: 'Tài khoản khách hàng',
          customer_full_name: 'Tên khách hàng',
          tracking: 'Last mile tracking',
        }
      },
    },
    serviceCode: {
      type: Object,
      default() {
        return {
          '': 'All service',
          S: 'Standard',
          E: 'Express',
          T: 'Ship by tiktok',
        }
      },
    },
    listWarehouse: {
      type: Object,
      default() {
        return {
          hn: 'Hà nội',
          hcm: 'TP Hồ Chí Minh',
        }
      },
    },
  },
  data() {
    return {
      filter: {
        limit: 200,
        status: '',
        search: '',
        search_by: 'code',
        start_date: '',
        end_date: '',
        code: '',
        service: '',
        warehouse_id: null,
        has_tiktok_label: false,
        is_early_scan: false,
      },
      labelDate: `Tìm theo ngày`,
      isUploading: false,
      resultImport: {},
      keywordSearch: '',
      allowSearch: true,
      isFetching: false,
      isFetchingCount: false,
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      isVisibleExport: false,
      isVisibleComfirmAdress: false,
      isSubmitting: false,
      isVisibleModalExtraFee: false,
      comfirmAddressPkg: null,
      selected: [],
      warehoseLoaded: false,
      PackageStatusDeactivate: PACKAGE_STATUS_DEACTIVATE,
      PackageStatusExpiredText: PACKAGE_STATUS_EXPIRED_TEXT,
      visibleModalImport: false,
      isExporting: false,
    }
  },
  created() {
    this.keywordSearch = this.filter.search.trim()
    this.init()
  },

  computed: {
    ...mapState('package', {
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
    }),
    ...mapState('shared', {
      wareHouses: (state) => state.wareHouses,
    }),
    hiddenClass() {
      return this.action.selected.length > 0 || this.isAllChecked
    },
    items() {
      return this.packages
    },
    showDetailPackage() {
      return !this.$isAccountant() && !this.$isSupport() && !this.$isSale()
    },
    statusTab() {
      return PACKAGE_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_STRING_PACKAGE
    },
    isShowButton() {
      return !this.$isSaleOperation()
    },
    searchPlaceholder() {
      const maptext = {
        id: 'Tìm theo mã hoá đơn',
        code: 'Tìm theo AnanBay tracking',
        recipient: 'Tìm theo tên người nhận',
        account: 'Tìm theo email hoặc sđt của khách hàng',
        order_number: 'Tìm theo mã đơn hàng',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
        customer_full_name: 'Tìm theo tên khách hàng',
        tracking: 'Tìm theo last mile tracking',
      }

      return maptext[this.filter.search_by] || maptext['id']
    },
    filteredPackages() {
      return this.packages
    },
  },
  methods: {
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    ...mapActions('package', [
      FETCH_LIST_PACKAGES,
      IMPORT_PACKAGE,
      EXPORT_PACKAGE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
      COUNT_LIST_PACKAGES,
      IMPORT_TRACKING,
      EXPORT_PACKAGE_AU,
      CONFIRM_ADDRESS,
      OCR_TIKTOK_LABEL,
    ]),
    ...mapActions('bill', [CREATE_EXTRA_FEE]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      this.filter = {
        ...this.$route.query,
        ...this.filter,
      }
      const r1 = await this[FETCH_LIST_PACKAGES](this.filter)
      this.isFetching = false
      if (!r1.success) {
        this.$toast.open({ message: r1.message, type: 'error' })
        return
      }
      this.isFetchingCount = true
      const r3 = await this[COUNT_LIST_PACKAGES](this.filter)
      this.isFetchingCount = false
      if (!r3.success) {
        this.$toast.open({ message: r3.message, type: 'error' })
      }
      if (!this.warehoseLoaded) {
        let req = { status: 1, type: 2 }
        const r2 = await this[FETCH_WAREHOUSE](req)
        if (!r2.success) {
          this.$toast.open({ message: r2.message, type: 'error' })
          return
        }
        this.warehoseLoaded = true
      }
    },
    showPackageCode(item) {
      if (item.status === PACKAGE_STATUS_ARCHIVED) {
        return false
      }
      return item.package_code
        ? item.package_code.status !== PACKAGE_CODE_TEMP
        : false
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
    },
    async importTrackingHandle(file) {
      this.isUploading = true
      const result = await this[IMPORT_TRACKING]({ file: file.raw })
      this.isUploading = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'import tracking thành công',
        duration: 3000,
      })
      this.visibleModalImport = false
    },
    showFormUpload() {
      this.visibleModalImport = true
    },
    showModalAddress(pkg) {
      this.isVisibleComfirmAdress = true
      this.comfirmAddressPkg = pkg
    },
    async handleConfirmAddress() {
      this.isFetching = true
      const result = await this[CONFIRM_ADDRESS]({
        coupon_user_id: null,
        ids: [this.comfirmAddressPkg.id],
      })
      if (result.success == true) {
        this.$toast.open({
          type: 'success',
          message: 'Xác nhận địa chỉ thành công',
          duration: 3000,
        })
      } else {
        this.$toast.open({
          type: 'error',
          message: 'Xác nhận địa chỉ thất bại, hãy thử lại sau',
          duration: 3000,
        })
      }
      this.isFetching = false
    },
    handleValue(e) {
      this.selected = [...e]
    },

    async downloadBarcode() {
      if (!this.selected.length) {
        this.$toast.open({
          type: 'warning',
          message: 'Vui lòng chọn ít nhất một hàng để xuất mã vạch!',
        })
        return
      }

      const allCodesEmpty = this.selected.every(
        (element) => element.code === null || element.code === ''
      )

      if (allCodesEmpty) {
        this.$toast.open({
          message: 'The selected order has no barcode!',
          type: 'error',
          duration: 3000,
        })
        return
      }

      try {
        const pdf = new jsPDF()
        let currentY = 10
        const lineHeight = 60

        const barcodeX = 10
        const barcodeWidth = 100

        for (const item of this.selected) {
          if (
            item.code === null ||
            !item.package_code ||
            !item.package_code.code
          )
            continue

          // Create a high-res canvas
          const canvas = document.createElement('canvas')
          const scale = 3
          const width = 300
          const height = 100
          canvas.width = width * scale
          canvas.height = height * scale
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.scale(scale, scale)
          }

          JsBarcode(canvas, item.package_code.code, {
            format: 'CODE128',
            displayValue: true,
            fontSize: 18,
            height: 70,
            width: 2,
            margin: 0,
          })

          const imageDataUrl = canvas.toDataURL('image/png')

          if (currentY + lineHeight > pdf.internal.pageSize.height) {
            pdf.addPage()
            currentY = 10
          }

          // Draw order number, centered above the barcode
          if (item.order_number) {
            const fontSize = 10
            pdf.setFontSize(fontSize)
            const text = `${item.order_number}`
            const textWidth = pdf.getTextWidth(text)
            const textX = barcodeX + (barcodeWidth - textWidth) / 2
            pdf.text(text, textX, currentY)
            currentY += 5
          }

          // Draw barcode image
          pdf.addImage(
            imageDataUrl,
            'PNG',
            barcodeX,
            currentY,
            barcodeWidth,
            40
          )
          currentY += lineHeight
        }

        pdf.save('barcode_list.pdf')
        this.$toast.open({
          type: 'success',
          message: 'Tải file PDF mã vạch thành công!',
        })
      } catch (error) {
        console.error('Lỗi khi tạo file PDF:', error)
        this.$toast.open({
          type: 'error',
          message: 'Đã xảy ra lỗi khi tạo file PDF. Vui lòng thử lại!',
        })
      }
    },
    async handleExport() {
      this.isVisibleExport = true
      const result = await this[EXPORT_PACKAGE]({
        ids: this.selectedIds,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this.isVisibleExport = false
        return
      }
      this.downloadFile(
        result.url,
        'packages',
        result.url.split('/'),
        'danh_sach_van_don_'
      )
      this.isVisibleExport = false
    },
    async handleOcrTiktok() {
      this.isFetching = true
      for (const pkg of this.selected) {
        if (pkg.service.code !== 'T' && pkg.custom_tiktok_barcode === '') {
          this.$toast.open({
            type: 'error',
            message: 'Có đơn không phải dịch vụ Tiktok được chọn.',
            duration: 3000,
          })
          this.isFetching = false
          return
        }
      }
      const result = await this[OCR_TIKTOK_LABEL]({
        ids: this.selectedIds,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this.isFetching = false
        return
      }
      this.isFetching = false
    },
    async handleSubmitExtraFee(param) {
      const payload = {
        user_id: [],
        package_code: [],
        ...param,
      }
      for (const pkg of this.selected) {
        if (pkg.package_code === null) {
          this.$toast.open({
            type: 'error',
            message: `Đơn hàng ${pkg.order_number} chưa tạo tracking, không thể thêm phí phát sinh`,
          })
          return
        } else {
          payload.user_id.push(pkg.user_id)
          payload.package_code.push(pkg.package_code.code)
        }
      }
      this.isSubmitting = true
      const result = await this[CREATE_EXTRA_FEE](payload)
      this.isSubmitting = false
      this.isVisibleModalExtraFee = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Tạo phí phát sinh thành công',
      })
      this.init()
    },

    async handlerDownloadLabels() {
      const files = []
      const selectedItems = this.selected.map((pkg) => ({
        order_number: pkg.order_number,
        code: pkg.code,
        url: pkg.label,
      }))

      const allEmpty = selectedItems.every((item) => !item.url)
      if (allEmpty) {
        this.$toast.open({
          type: 'error',
          message: 'Đơn hàng đã chọn không có nhãn!',
        })
        return
      }

      await this.processItemsConcurrently(selectedItems, async (item) => {
        try {
          let blob, type

          if (item.url.startsWith('http')) {
            const res = await fetch(item.url)
            if (!res.ok) throw new Error('Fetch failed')

            blob = await res.blob()
            type = blob.type
          } else {
            const res = await api.fetchFile({ url: item.url, type: 'labels' })
            if (!res || res.error) throw new Error('Invalid file response')

            blob = res
            type = res.type || ''
          }

          if (type === 'application/pdf') {
            files.push({ blob, type: 'pdf' })
          } else if (type.startsWith('image/')) {
            files.push({ blob, type })
          } else {
            this.$toast.open({
              type: 'error',
              message: `Không hỗ trợ: ${item.order_number}`,
            })
          }
        } catch (err) {
          this.$toast.open({
            type: 'error',
            message: `Lỗi: ${item.order_number}`,
          })
        }
      })

      await this.openPrintWindow(files)
    },

    async openPrintWindow(files) {
      if (files.length === 0) return

      const mergedPdf = await PDFDocument.create()

      for (const { blob, type } of files) {
        const bytes = await blob.arrayBuffer()

        if (type === 'pdf') {
          const pdf = await PDFDocument.load(bytes)
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
          pages.forEach((p) => mergedPdf.addPage(p))
        } else {
          const imagePdf = await PDFDocument.create()
          const imgData = new Uint8Array(bytes)
          const img =
            type === 'image/png'
              ? await imagePdf.embedPng(imgData)
              : await imagePdf.embedJpg(imgData)

          const page = imagePdf.addPage([img.width + 60, img.height + 60])
          page.drawImage(img, {
            x: 30,
            y: 30,
            width: img.width,
            height: img.height,
          })

          const imgBytes = await imagePdf.save()
          const tempPdf = await PDFDocument.load(imgBytes)
          const tempPages = await mergedPdf.copyPages(
            tempPdf,
            tempPdf.getPageIndices()
          )
          tempPages.forEach((p) => mergedPdf.addPage(p))
        }
      }

      const output = await mergedPdf.save()
      const blob = new Blob([output], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')

      if (win) {
        win.onload = () => win.print()
      } else {
        console.error('Không thể mở cửa sổ in')
      }
    },
    async processItemsConcurrently(items, handler, maxConcurrent = 10) {
      const results = []
      let i = 0

      const next = async () => {
        if (i >= items.length) return
        const index = i++
        try {
          results[index] = await handler(items[index])
        } catch (error) {
          results[index] = null
        }
        return next()
      }

      // Kick off initial batch
      await Promise.all(Array.from({ length: maxConcurrent }, next))
      return results
    },

    convertPrice(item) {
      if (item.status_string == PACKAGE_STATUS_CREATED_TEXT) {
        return this.calculateFee(item.weight) + item.shipping_fee
      } else {
        return item.shipping_fee
      }
    },
    description(alert) {
      switch (alert) {
        case PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT:
          return 'Quá 7 ngày chờ lấy'
        case PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN:
          return 'Bị kho trả lại'
        case PACKAGE_ALERT_TYPE_HUB_RETURN:
          return 'Hàng bị trả lại'
      }
    },
    async handleExportPackage(payload) {
      this.isExporting = true
      const result = await this[EXPORT_PACKAGE_AU](payload)
      this.isExporting = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      if (result.is_queue) {
        this.$toast.open({
          type: 'success',
          message: 'Yêu cầu đang được xử lý',
          duration: 3000,
        })
      } else {
        this.downloadPackage(result.url, 'packages', result.url.split('/')[1])
      }
    },
    toggleHasTiktokLabel(value) {
      this.filter.has_tiktok_label = value
    },
    toggleIsEarlyScan(value) {
      this.filter.is_early_scan = value
    },
  },
  watch: {
    filter: {
      handler: function () {
        if (this.isFetching) {
          return
        }
        this.init()
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="scss">
.p-tooltip::after {
  width: auto !important;
  white-space: pre;
}

td.code {
  max-width: 20vw !important;

  span.link-code,
  span.svg {
    position: relative;
    top: 3px;
  }
}

.fee .p-tooltip::after {
  white-space: pre !important;
}

.no-track-code,
.no-pkg-code {
  position: relative;
  left: 50px;
  display: inline-block;
}

.form-control {
  width: 80px;
}
.limit-selector {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.limit-selector .label {
  white-space: nowrap;
}
</style>
