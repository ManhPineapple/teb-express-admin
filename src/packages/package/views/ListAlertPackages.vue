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
            @keyup.enter="handleSearch"
            @clear="clearSearch"
            @input="checkClearSearch"
          >
          </p-input>
          <p-select
            class="ml-8"
            style="width: auto"
            placeholder="Please select"
            v-model="filter.search_by"
          >
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
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
          <multiselect
            v-model="sort"
            class="ml-8"
            :options="optionFilter"
            @select="handleSelect"
            @remove="handleRemove"
            :placeholder="placeHolder"
            :custom-label="customLabel"
          >
          </multiselect>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="packages.length">
            <div
              class="table-responsive"
              style="overflow: unset; position: relative"
            >
              <table class="table table-hover table-packages" id="tbl-packages">
                <thead>
                  <div
                    style="top: 14px"
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
                      <th :class="{ hidden: hiddenClass }">ananbay tracking</th>
                      <th :class="{ hidden: hiddenClass }"
                        >last mile tracking</th
                      >
                      <th :class="{ hidden: hiddenClass }">Khách hàng</th>
                      <th :class="{ hidden: hiddenClass }">Ngày tạo</th>
                      <th>Ngày còn lại</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in packages"
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
                      <TrackLink v-if="item.tracking" :current="item" />
                      <span
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                        v-else
                        >N/A</span
                      >
                    </td>
                    <td>
                      {{ item.user.full_name }}
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ item.day_left }}</td>
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
    <modal-export :visible="isVisibleExport"> </modal-export>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import mixinDownload from '@/packages/shared/mixins/download'
import ModalExport from '../components/ModalExport'
import { date } from '@core/utils/datetime'

import {
  PACKAGE_STATUS_TAB,
  MAP_NAME_STATUS_STRING_PACKAGE,
  PACKAGE_STATUS_DEACTIVATE,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT,
  PACKAGE_CODE_TEMP,
  PACKAGE_STATUS_ARCHIVED,
} from '../constants'
import {
  FETCH_LIST_PACKAGES,
  COUNT_LIST_PACKAGES,
  IMPORT_PACKAGE,
  EXPORT_PACKAGE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import TrackLink from '../components/TrackLink.vue'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    ModalExport,
    TrackLink,
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
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: 'pre-transit',
        search: '',
        search_by: 'code',
        start_date: '',
        end_date: '',
        code: '',
        sort: '',
      },
      optionFilter: [
        {
          key: 'ASC',
          name: 'Tăng dần',
        },
        {
          key: 'DESC',
          name: 'Giảm dần',
        },
      ],
      sort: null,
      placeHolder: 'Ngày còn lại',
      labelDate: `Tìm theo ngày`,
      isUploading: false,
      resultImport: {},
      keywordSearch: '',
      allowSearch: true,
      isFetching: false,
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      isVisibleExport: false,
      selected: [],
      PackageStatusDeactivate: PACKAGE_STATUS_DEACTIVATE,
      PackageStatusExpiredText: PACKAGE_STATUS_EXPIRED_TEXT,
    }
  },
  created() {
    this.init()
  },

  computed: {
    ...mapState('package', {
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
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
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PACKAGES,
      IMPORT_PACKAGE,
      EXPORT_PACKAGE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
      COUNT_LIST_PACKAGES,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      // this.keywordSearch = this.filter.search.trim()
      this.filter.alert = PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT
      let [r1, r2] = await Promise.all([
        this[FETCH_LIST_PACKAGES](this.filter),
        this[COUNT_LIST_PACKAGES](this.filter),
      ])
      this.isFetching = false
      if (!r1.success || !r2.success) {
        this.$toast.open({ message: r1.message || r2.message, type: 'error' })
      }
    },
    customLabel({ key, name }) {
      return typeof key !== 'undefined' ? `${name}` : ''
    },
    handleSelect(item) {
      this.$set(this.filter, 'sort', item.key)
    },
    handleRemove() {
      this.$set(this.filter, 'sort', '')
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
    handleValue(e) {
      this.selected = JSON.parse(JSON.stringify(e))
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

<style lang="scss">
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

.no-track-code,
.no-pkg-code {
  position: relative;
  left: 50px;
  display: inline-block;
}

.clear-date {
  position: absolute !important;
  margin-top: unset !important;
  margin-left: unset !important;
  right: 26px;
  top: 4px !important;
}
</style>
