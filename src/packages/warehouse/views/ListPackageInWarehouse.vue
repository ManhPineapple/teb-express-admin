<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Tìm theo mã tracking ..."
          prefixIcon="search"
          type="search"
          clearable
          v-model="keywordSearch"
          @keyup.enter="handleSearch"
          @clear="clearSearch"
        >
        </p-input>
        <p-button
          v-if="!$isSaleOperation()"
          id="export-btn"
          @click="handleShowModalExport"
          class="btn btn-info ml-3 text-nowrap"
          >Export</p-button
        >
        <p-button
          v-if="!$isSaleOperation()"
          id="export-btn"
          @click="handleShowModalExportWrong"
          class="btn btn-info ml-3 text-nowrap"
          >Xuất hàng lệch cân</p-button
        >
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="packages.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>AnanBay tracking</th>
                      <th>Trạng thái</th>
                      <th>Thành phố</th>
                      <th>Mã bang</th>
                      <th>Mã bưu điện </th>
                      <th width="100">Dịch vụ</th>
                      <th>Nhãn đơn</th>
                      <th>Nhãn kiện</th>
                      <th>Mã kiện</th>
                      <th>ID lô</th>
                      <th>Ngày quét vào kho</th>
                      <th></th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in packages"
                    :key="i"
                    :class="{ hover: isChecked(item) }"
                  >
                    <td>
                      <router-link
                        class="text-no-underline"
                        v-if="$isAdmin() || $isSaleOperation()"
                        :to="{
                          name: 'package-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.code }}
                      </router-link>
                      <span v-else class="text-no-underline">{{
                        item.code
                      }}</span>
                    </td>
                    <td>
                      <span
                        v-status:status="item.status"
                        type="warehouse"
                      ></span>
                    </td>
                    <td>
                      {{ item.city }}
                    </td>
                    <td> {{ item.state_code }} </td>
                    <td>{{ item.zipcode }}</td>
                    <td>{{ item.service_name }}</td>
                    <td>
                      <a
                        class="text-no-underline"
                        v-if="item.tracking && item.tracking.length > 0"
                        @click="showLabel(item.tracking[0].label_url)"
                      >
                        {{ item.tracking[0].tracking_number }}
                      </a>
                      <span v-else>-</span>
                    </td>
                    <td
                      ><a
                        class="text-no-underline"
                        v-if="item.container_tracking_number"
                        @click="showLabel(item.container_label_url)"
                      >
                        {{ item.container_tracking_number }}
                      </a>
                      <span v-else>-</span></td
                    >
                    <td>
                      <router-link
                        class="text-no-underline"
                        v-if="item.container_id"
                        :to="{
                          name: 'container-detail',
                          params: {
                            code: item.container_code
                              ? item.container_code
                              : '',
                          },
                        }"
                      >
                        {{ item.container_code ? item.container_code : '' }}
                      </router-link>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <router-link
                        v-if="item.shipment_id"
                        class="text-no-underline"
                        :to="{
                          name: 'shipment-detail',
                          params: { id: item.shipment_id },
                        }"
                      >
                        {{ item.shipment_id }}
                      </router-link>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <time v-if="item.checkin_warehouse_at">{{
                        item.checkin_warehouse_at | date('dd/MM/yyyy HH:mm')
                      }}</time>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <div>
                        <p-button
                          v-if="
                            item.status == PackageWareHouseStatusPick &&
                            !$isSaleOperation()
                          "
                          @click="acceptHandle(item.code)"
                          class="mr-2 btn-check"
                          type="info"
                        >
                          Kiểm hàng
                        </p-button>
                      </div>
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
                :fixed-limit="true"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-export
      :visible.sync="visibleExportModal"
      :loading="isExporting"
      @save="handleExport"
    >
    </modal-export>
    <modal-wrong-weight
      :visible.sync="isvisibleExportWrongModal"
      :loading="isExporting"
      @export="handleExportWrongWeight"
    >
    </modal-wrong-weight>
    <modal-label :visible.sync="isVisibleModalCreateLabelPdf"> </modal-label>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { truncate } from '@core/utils/string'
import { print } from '@core/utils/print'
import ModalExport from '../components/ModalExport'
import ModalWrongWeight from '../components/ModalWrongWeight'
import ModalLabel from '../components/ModalLabel'
import { date } from '@core/utils/datetime'
import {
  PACKAGE_IN_WAREHOUSE_STATUS_TAB,
  PACKAGE_WAREHOUSE_STATUS_PICK,
  PACKAGE_WAREHOUSE_STATUS_RETURN,
} from '../constants'
import {
  FETCH_LIST_PACKAGES_IN_WAREHOUSE,
  COUNT_LIST_PACKAGES_IN_WAREHOUSE,
  EXPORT_WAREHOUSE_PACKAGES,
  EXPORT_WAREHOUSE_PACKAGES_WRONG,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinDownload from '@/packages/shared/mixins/download'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'ListPackageInWarehouse',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    ModalWrongWeight,
    EmptySearchResult,
    ModalExport,
    ModalLabel,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        code: '',
      },
      export: {
        start_date: '',
        end_date: '',
      },
      label: `Date`,
      isUploading: false,
      isExporting: false,
      disableExport: true,
      resultImport: {},
      keywordSearch: '',
      allowSearch: true,
      isFetching: false,
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      isVisibleModalCreateLabelPdf: false,
      isvisibleExportWrongModal: false,
      selected: [],
      searchBy: {
        code: 'AnanBay tracking',
        order_number: 'Mã đơn hàng',
        recipient: 'Người nhận',
        account: 'Tài khoản khách',
      },
      PackageWareHouseStatusPick: PACKAGE_WAREHOUSE_STATUS_PICK,
      PackageWareHouseStatusReturn: PACKAGE_WAREHOUSE_STATUS_RETURN,
      visibleExportModal: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search.trim()
    this.init()
  },
  computed: {
    ...mapState('warehouse', {
      packages: (state) => state.packages_in_warehouse,
      count: (state) => state.count_packages_in_warehouse,
      count_status: (state) => state.count_status,
    }),
    hiddenClass() {
      return this.action.selected.length > 0 || this.isAllChecked
    },
    items() {
      return this.packages
    },
    statusTab() {
      return PACKAGE_IN_WAREHOUSE_STATUS_TAB
    },
  },
  methods: {
    truncate,

    ...mapActions('warehouse', {
      fetchPackages: FETCH_LIST_PACKAGES_IN_WAREHOUSE,
      exportPackage: EXPORT_WAREHOUSE_PACKAGES,
      exportPackageWrong: EXPORT_WAREHOUSE_PACKAGES_WRONG,
    }),

    ...mapMutations('warehouse', {
      setPackages: FETCH_LIST_PACKAGES_IN_WAREHOUSE,
      setCount: COUNT_LIST_PACKAGES_IN_WAREHOUSE,
    }),

    async init() {
      this.setPackages([])
      this.setCount({
        count: 0,
        status_count: [{ status: 0, count: 0 }],
      })

      if (!this.filter.search) {
        return
      }

      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.keywordSearch = this.filter.search.trim()

      const result = await this.fetchPackages(this.filter)

      this.isFetching = false

      if (!result || !result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },

    acceptHandle(code) {
      this.$router.push({ name: 'check-package', query: { keyword: code } })
    },
    handleShowModalExport() {
      this.visibleExportModal = true
    },
    selectDate(v) {
      if (v.startDate !== null && v.endDate !== null) {
        const time = v.endDate.getTime() - v.startDate.getTime()
        const diff_days = Math.floor(time / (1000 * 3600 * 24))
        if (diff_days > 6) {
          this.$toast.error('Khoảng tìm kiếm chỉ trong vòng 7 ngày')
          this.disableExport = true
          return
        }
      }
      this.export.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.export.end_date = date(v.endDate, 'yyyy-MM-dd')
      this.disableExport = false
    },
    clearDate() {
      this.export.end_date = ''
      this.export.start_date = ''
      this.label = 'Date'
      this.disableExport = true
    },
    async handleExport(payload) {
      this.isExporting = true
      const result = await this.exportPackage(payload)
      this.isExporting = false

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadPackage(result.url, 'packages', result.url.split('/')[1])
    },

    async handleExportWrongWeight(payload) {
      console.log(payload)
      this.isExporting = true
      const result = await this.exportPackageWrong(payload)
      this.isExporting = false

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadPackage(result.url, 'packages', result.url.split('/')[1])
    },
    async showLabel(label) {
      if (!label) {
        this.$toast.error(`This tracking doesn't have label`)
        return
      }

      document.activeElement && document.activeElement.blur()
      try {
        print(label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    handleShowModalExportWrong() {
      this.isvisibleExportWrongModal = true
    },
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

<style>
.filter-date {
  float: left;
  min-width: 212px !important;
}
.filter-date > div {
  line-height: 28px;
}
.filter-date + button.close {
  width: 40px;
  height: 40px;
  float: left;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
}
#export-btn {
  border-color: inherit;
  float: right;
}
.btn-check {
  white-space: nowrap;
}
</style>
