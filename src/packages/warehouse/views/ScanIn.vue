<template>
  <div class="pages scan-in">
    <div class="page-content">
      <div class="mb-24">
        <div class="actions">
          <button class="btn btn-info" v-if="!iscan" @click="startHandle">
            <svgicon name="play" width="20" height="20" />
            Bắt đầu quét
          </button>
          <button class="btn btn-danger" v-if="iscan" @click="stopHandle">
            <svgicon name="pause" width="20" height="20" />
            Dừng quét
          </button>
          <button class="btn btn-white ml-20" v-if="iscan">
            Số lượng đã quét: <b>{{ total }}</b>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <div class="card mb-16">
            <div class="card-body">
              <div class="d-flex">
                <p-input
                  ref="input"
                  :disabled="disableInput"
                  v-model="keyword"
                  @keydown.enter.prevent="searchHandle"
                  placeholder="Nhập mã đơn hàng"
                ></p-input>
                <button
                  @click.prevent="searchHandle"
                  :disabled="disableBtnScan"
                  class="btn btn-inline-info ml-3 text-nowrap"
                  >Quét
                </button>
                <button
                  class="btn btn-inline-info ml-3 text-nowrap"
                  :disabled="disableBtnAccept"
                  :loading="isCheckingRelabel"
                  @click.prevent="acceptHandle"
                  >Xác nhận
                </button>
                <button
                  class="btn btn-inline-danger ml-3 text-nowrap"
                  :disabled="disableBtnReturn"
                  @click="showModalReturnHandle(null)"
                  >Trả hàng
                </button>
              </div>
            </div>
          </div>
          <div class="card mb-16">
            <div class="card-header">
              <div class="card-title">Kiểm tra loại hàng</div>
            </div>
            <div class="card-body">
              <div class="package-info">
                <div class="row">
                  <div class="col-6 first">
                    <div class="d-flex">
                      <span>Mã vận đơn:</span>
                      <span>{{ codecurrent }}</span>
                    </div>
                    <div class="d-flex">
                      <span>Người gửi:</span>
                      <span>{{ customer }}</span>
                    </div>
                    <div class="d-flex">
                      <span>Mã tracking:</span>
                      <span>{{ trackingCurrent }}</span>
                    </div>
                  </div>
                  <div class="col-6 second">
                    <div class="d-flex">
                      <span>Thông tin đơn:</span>
                      <span>{{ current.detail }}</span>
                    </div>
                    <div class="d-flex">
                      <span>Trạng thái:</span>
                      <span v-status="current.status" type="warehouse"></span>
                    </div>
                    <div class="d-flex">
                      Destination Hub:
                      {{
                        current.tracking && current.tracking.warehouse
                          ? `Hub ${current.tracking.warehouse.state}`
                          : 'N/A'
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
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
                      v-model.number="form.actual_weight"
                      placeholder="eg: 69 (đơn vị grams)"
                      :disabled="!isHasUpdate"
                      :error="errors.actual_weight"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_length"
                      placeholder="eg: 15 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                      :error="errors.actual_length"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_width"
                      placeholder="eg: 10 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                      :error="errors.actual_width"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_height"
                      placeholder="eg: 3 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                      :error="errors.actual_height"
                    ></p-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer pt-4">
              <div class="d-flex" style="align-self: flex-start">
                <span>Kết quả:</span>
                <div class="messages pl-5">
                  <p v-if="!messages.length" class="mb-0 text-success"
                    >Phù hợp</p
                  >
                  <p
                    v-else
                    v-for="(message, i) in messages"
                    :key="i"
                    class="mb-0 text-danger"
                    >{{ message }}</p
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4" style="min-height: 100%">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="package-tab"
                data-toggle="tab"
                href="#package"
                role="tab"
                aria-controls="package"
                aria-selected="true"
                >Đơn hàng</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="user-tab"
                data-toggle="tab"
                href="#user"
                role="tab"
                aria-controls="user"
                aria-selected="false"
                >Người gửi</a
              >
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="package"
              role="tabpanel"
              aria-labelledby="package-tab"
            >
              <div class="empty" v-if="!packages.length">
                <p-svg name="empty"></p-svg>
                <p>Chưa có đơn hàng được quét!</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover table-packages">
                  <thead>
                    <tr>
                      <template>
                        <th>Mã vận đơn</th>
                        <th width="150">Trạng thái</th>
                        <th width="10"></th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in packages" :key="i">
                      <td class="">
                        <span>{{ item.code }}</span>
                        <span v-if="item.alert" class="ml-8">
                          <p-tooltip
                            class="item_name"
                            :label="item.alert"
                            position="right"
                            type="dark"
                          >
                            <p-svg :name="item.alert_icon"></p-svg>
                          </p-tooltip>
                        </span>
                      </td>
                      <td v-html="item.statusHTML"></td>
                      <td width="10">
                        <a
                          href="#"
                          @click.prevent="showModalReturnHandle(item)"
                        >
                          <p-svg name="return"></p-svg>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="result d-flex jc-sb">
                <span
                  >Kết quả:
                  <span
                    :class="{
                      'text-success': countSuccess == countTotal,
                      'text-danger': countSuccess < countTotal,
                    }"
                    >{{ countSuccess }}/{{ countTotal }}</span
                  ></span
                >
                <div>
                  <button class="btn btn-info" @click="exportToCSV">
                    Export
                  </button>
                  <button
                    class="btn btn-info"
                    @click="handleAccepts"
                    :disabled="disableBtnAccepts"
                  >
                    Duyệt lại
                  </button>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="user"
              role="tabpanel"
              aria-labelledby="user-tab"
            >
              <div class="empty" v-if="!groups.length">
                <p-svg name="empty"></p-svg>
                <p>Chưa có đơn hàng được quét!</p>
              </div>
              <div v-else class="accordion" id="scanin-list">
                <div class="card" v-for="group in groups" :key="group.id">
                  <div class="card-header">
                    <a
                      href="#"
                      :class="{ collapsed: !group.show }"
                      @click.prevent="collapseToggle(group.id)"
                    >
                      <p-svg name="up-white"></p-svg>
                    </a>
                    <div class="head">
                      <span
                        >Người gửi: <b>{{ group.name }}</b></span
                      >
                      <span
                        >Số lượng:
                        <b :class="checkSusccess(group)">{{
                          group.count
                        }}</b></span
                      >
                    </div>
                  </div>

                  <div
                    class="accordion-collapse collapse"
                    :class="{ show: group.show }"
                  >
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-hover table-user">
                          <tr>
                            <th>Mã đơn hàng</th>
                            <th>Trạng thái</th>
                          </tr>
                          <tbody>
                            <tr v-for="item in group.items" :key="item.id">
                              <td class="d-flex">
                                <span>{{ item.code }}</span>
                                <span v-if="item.alert" class="ml-8">
                                  <p-tooltip
                                    class="item_name"
                                    :label="item.alert"
                                    position="right"
                                    type="dark"
                                  >
                                    <p-svg :name="item.alert_icon"></p-svg>
                                  </p-tooltip>
                                </span>
                              </td>
                              <td v-html="item.statusHTML"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetching" />
    <ModalReturn
      :visible.sync="isVisibleModalReturn"
      :current="current"
      @submit="returnSubmit"
    />
  </div>
</template>
<script>
import PageLoading from '@components/shared/OverLoading'
import mixinBarcode from '@core/mixins/barcode'
import mixinTable from '@core/mixins/table'
import { mapActions, mapMutations, mapState } from 'vuex'
import { yup } from '../../../core/valider'
import ModalReturn from '../components/ModalReturn'
import {
  CHECKIN_PACKAGE_STATUS_CHANGE_LABEL,
  CHECKIN_PACKAGE_STATUS_FAILED,
  CHECKIN_PACKAGE_STATUS_INVALID,
  CHECKIN_PACKAGE_STATUS_SUCCESS,
  CHECKIN_PACKAGE_STATUS_UPDATE_LABEL_FAILED,
  PACKAGE_STATUS_PENDING_PICKUP,
  PACKAGE_WAREHOUSE_STATUS_PICK,
} from '../constants'
import {
  CHECK_RELABEL,
  CLOSE_CHECKIN_REQUEST,
  GET_CHECKIN_REQUEST,
  GET_PACKAGE_BY_CODE,
  PACKAGE_CREATE_LABEL,
  RETURN_PACKAGE,
  UPDATE_STATUS_PACKAGE,
} from '../store'

export default {
  name: 'CheckPackage',
  components: { ModalReturn, PageLoading },
  mixins: [mixinBarcode, mixinTable],
  computed: {
    ...mapState('warehouse', {
      current: (state) => state.package,
    }),
    messages() {
      if (!this.current.id) return []

      const messages = []
      if (this.form.actual_weight > this.current.actual_weight) {
        messages.push('Trọng lượng vượt ngưỡng')
      }

      if (this.form.actual_length > this.current.actual_length) {
        messages.push('Chiều dài vượt ngưỡng')
      }

      if (this.form.actual_width > this.current.actual_width) {
        messages.push('Chiều rộng vượt ngưỡng')
      }

      if (this.form.actual_height > this.current.actual_height) {
        messages.push('Chiều cao vượt ngưỡng')
      }

      return messages
    },
    hasChange() {
      return this.messages.length
    },
    disableBtnReturn() {
      return (
        !this.current || !this.current.id || this.isFetching || this.iscaned
      )
    },
    disableBtnAccept() {
      return (
        !this.current ||
        !this.current.id ||
        this.isFetching ||
        !this.hasAccept ||
        this.iscaned
      )
    },
    disableBtnScan() {
      return (
        !this.keyword ||
        !this.iscan ||
        this.isFetching ||
        (this.codecurrent == this.keyword && this.codecurrent != '') ||
        (this.trackingCurrent == this.keyword && this.trackingCurrent != '')
      )
    },
    disableBtnAccepts() {
      let arrPkgs = this.packages.filter(
        (i) => i.status_checkin == CHECKIN_PACKAGE_STATUS_FAILED
      )
      return !arrPkgs.length
    },
    isHasUpdate() {
      return (
        this.current &&
        this.current.id &&
        !this.isFetching &&
        this.current.status == PACKAGE_STATUS_PENDING_PICKUP
      )
    },
    codecurrent() {
      return !this.current || !this.current.package_code
        ? ''
        : this.current.package_code.code || ''
    },
    trackingCurrent() {
      return !this.current || !this.current.tracking
        ? ''
        : this.current.tracking.tracking_number || 'N/A'
    },
    customer() {
      return !this.current || !this.current.user
        ? ''
        : this.current.user.full_name ||
            this.current.user.email ||
            this.current.user.phone_number
    },
    hasAccept() {
      return this.current && this.current.id && !this.hasError
    },
    total() {
      return this.packages.length
    },
    items() {
      return this.packages
    },
    errors() {
      if (!this.current.id) return {}

      const errors = {}

      if (this.form.actual_weight <= 0) {
        errors['actual_weight'] = 'Trọng lượng thực > 0'
      } else if (!this.validNumber.isValidSync(this.form.actual_weight)) {
        errors['actual_weight'] = 'Trọng lượng thực không đúng định dạng'
      }

      if (this.form.actual_length <= 0) {
        errors['actual_length'] = 'Chiều dài thực > 0'
      } else if (!this.validNumber.isValidSync(this.form.actual_length)) {
        errors['actual_length'] = 'Chiều dài thực không đúng định dạng'
      }

      if (this.form.actual_width <= 0) {
        errors['actual_width'] = 'Chiều rộng thực > 0'
      } else if (!this.validNumber.isValidSync(this.form.actual_width)) {
        errors['actual_width'] = 'Chiều rộng thực không đúng định dạng'
      }

      if (this.form.actual_height <= 0) {
        errors['actual_height'] = 'Chiều cao thực > 0'
      } else if (!this.validNumber.isValidSync(this.form.actual_height)) {
        errors['actual_height'] = 'Chiều cao thực không đúng định dạng'
      }

      return errors
    },

    hasError() {
      return Object.keys(this.errors).length > 0
    },
    packagesReverse() {
      return [...this.packages].reverse()
    },
    countSuccess() {
      return this.packages.filter(
        (x) =>
          x.status_checkin == CHECKIN_PACKAGE_STATUS_SUCCESS &&
          x.status != PACKAGE_STATUS_PENDING_PICKUP
      ).length
    },
    countTotal() {
      return this.packages.filter(
        (x) =>
          (x.status_checkin == CHECKIN_PACKAGE_STATUS_SUCCESS &&
            x.status != PACKAGE_STATUS_PENDING_PICKUP) ||
          x.status_checkin == CHECKIN_PACKAGE_STATUS_FAILED
      ).length
    },
  },
  mounted() {
    this.beforeLeaveHandle()
  },
  data() {
    return {
      iscan: false,
      iscaned: false,
      isFetching: false,
      keyword: '',
      isSubmitting: false,
      isCheckingRelabel: false,
      form: {
        actual_weight: 0,
        actual_length: 0,
        actual_width: 0,
        actual_height: 0,
      },
      isVisibleModalReturn: false,
      checkinRequestId: 0,
      packages: [],
      groups: [],
      disableInput: false,
      validNumber: yup.number(),
    }
  },
  methods: {
    ...mapActions('warehouse', {
      fetchPackage: GET_PACKAGE_BY_CODE,
      createLabel: PACKAGE_CREATE_LABEL,
      getCheckinRequest: GET_CHECKIN_REQUEST,
      closeCheckinRequest: CLOSE_CHECKIN_REQUEST,
      returnPackageRequest: RETURN_PACKAGE,
      checkRelabel: CHECK_RELABEL,
    }),
    ...mapMutations('warehouse', {
      setPackage: GET_PACKAGE_BY_CODE,
      updateStatus: UPDATE_STATUS_PACKAGE,
    }),

    async stopHandle() {
      if (this.isFetching || this.isSubmitting) return

      if (this.hasAccept && !this.iscaned) {
        if (!this.hasChange) {
          await this.acceptSubmit()
        } else {
          try {
            const result = await this.confirmHandle()
            if (!result) return

            await this.acceptSubmit()
          } catch (error) {
            console.log(error)
          }
        }
      }

      const res = await this.closeCheckinRequest({ id: this.checkinRequestId })

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.iscan = false
      this.iscaned = false
      this.checkinRequestId = 0
      this.keyword = ''
      this.groups = []
      this.packages = []
      this.setPackage({})
      this.reset()
    },

    async startHandle() {
      if (this.isFetching || this.isSubmitting) return

      this.iscaned = false
      this.isFetching = true
      this.reset()
      this.setPackage({})

      const res = await this.getCheckinRequest()

      if (res.error || !res.checkin) {
        this.isFetching = false
        this.$toast.error(res.message)
        return
      }

      this.iscan = true
      this.checkinRequestId = res.checkin.id
      let packages =
        res.checkin && res.checkin.checkin_package
          ? res.checkin.checkin_package.map((x) => {
              return Object.assign(
                { ...x.package },
                { status_checkin: x.status }
              )
            })
          : []
      for (const pkg of packages) {
        if (!pkg.package_code || !pkg.user) {
          continue
        }
        const code = pkg.package_code.code
        const tracking_number = !pkg.tracking
          ? ''
          : pkg.tracking.tracking_number || ''
        const customer =
          pkg.user.full_name || pkg.user.email || pkg.user.phone_number

        let item = {
          id: pkg.id,
          code,
          tracking_number,
          status: pkg.status,
          status_checkin: pkg.status_checkin,
          detail: pkg.detail,
          statusHTML: '<span class="text-success">Thành công</span>',
          alert: '',
        }

        if (item.status == PACKAGE_STATUS_PENDING_PICKUP) {
          item.statusHTML = '<span class="text-warning">Trả hàng</span>'
        }

        if (item.status_checkin == CHECKIN_PACKAGE_STATUS_FAILED) {
          item.statusHTML = '<span class="text-danger">Thất bại</span>'
        }

        if (item.status_checkin == CHECKIN_PACKAGE_STATUS_INVALID) {
          item.statusHTML = '<span class="text-invalid">Không hợp lệ</span>'
        }

        if (item.status_checkin == CHECKIN_PACKAGE_STATUS_UPDATE_LABEL_FAILED) {
          item.alert = 'Update label lỗi'
          item.alert_icon = 'alert'
        }

        if (item.status_checkin == CHECKIN_PACKAGE_STATUS_CHANGE_LABEL) {
          item.alert = 'Label đã được thay đổi'
          item.alert_icon = 'warning'
        }

        this.packages.unshift(item)

        let group = this.groups.find(({ id }) => id == pkg.user.id)
        if (group) {
          group.count++
          group.items.push(item)
          continue
        }

        this.groups.push({
          id: pkg.user.id,
          count: 1,
          name: customer,
          show: false,
          items: [item],
        })
      }
      this.isFetching = false
    },

    searchHandle() {
      const keyword = this.keyword.trim()
      this.beforeFetchPackage(keyword)
    },

    barcodeSubmit(keyword) {
      this.disableInput = true
      keyword = keyword.trim()
      if (keyword.length == 38) {
        keyword = keyword.slice(-26).trim()
      } else if (keyword.length > 40) {
        keyword = keyword.slice(-23).trim()
      }
      // else if (keyword.length > 24) {
      //   keyword = keyword.slice(-22).trim()
      // }

      this.keyword = keyword
      this.beforeFetchPackage(this.keyword)
      this.disableInput = false
      return
    },

    async beforeFetchPackage(keyword) {
      if (this.codecurrent === keyword) return

      if (this.isFetching || this.isSubmitting) return

      const index = this.packages.findIndex(
        ({ code, tracking_number }) =>
          code == keyword || tracking_number == keyword
      )
      if (index !== -1) {
        this.$toast.warning(`Mã ${keyword} đã được quét`)
        return
      }

      if (this.hasAccept && !this.iscaned) {
        if (!this.hasChange) {
          await this.acceptSubmit()
        } else {
          try {
            const result = await this.confirmHandle()
            if (!result) return

            await this.acceptSubmit()
          } catch (error) {
            console.log(error)
          }
        }
      }

      this.isFetching = true
      await this.fetchPackge(keyword)
      setTimeout(() => {
        this.isFetching = false
      }, 200)
    },

    async fetchPackge(keyword) {
      if (!this.iscan) {
        this.$toast.warning('Vui lòng bấm bắt đầu quét để quét')
        return
      }

      this.iscaned = false
      this.reset()
      keyword = keyword.trim()
      if (keyword.length == 38) {
        keyword = keyword.slice(-26).trim()
      } else if (keyword.length > 40) {
        keyword = keyword.slice(-23).trim()
      } else if (keyword.length > 24 && keyword.length != 26) {
        keyword = keyword.slice(-22).trim()
      }
      const res = await this.fetchPackage(keyword)
      if (res.error) {
        this.$toast.error(res.message)
      }
      if (!this.current || !this.current.id) {
        return
      }
      this.updateVolum()
    },

    updateVolum() {
      this.form.actual_width = this.current.actual_width
      if (this.form.actual_width >= 0) {
        this.form.actual_width = this.current.width
      }

      this.form.actual_height = this.current.actual_height
      if (this.form.actual_height >= 0) {
        this.form.actual_height = this.current.height
      }

      this.form.actual_length = this.current.actual_length
      if (this.form.actual_length >= 0) {
        this.form.actual_length = this.current.length
      }

      this.form.actual_weight = this.current.actual_weight
      if (this.form.actual_weight >= 0) {
        this.form.actual_weight = this.current.weight
      }
    },

    async acceptHandle() {
      if (!this.hasChange) {
        return await this.acceptSubmit()
      }

      try {
        const result = await this.confirmHandle()
        if (!result) {
          return false
        }

        return await this.acceptSubmit()
      } catch (error) {
        return false
      }
    },

    async acceptSubmit() {
      if (
        this.isFetching ||
        this.isSubmitting ||
        !this.current ||
        !this.current.id ||
        this.hasError
      )
        return

      this.isSubmitting = true

      const form = Object.assign(
        {
          id: this.current.id,
          checkin_request_id: this.checkinRequestId,
        },
        this.form
      )

      const res = await this.createLabel(form)
      if (res.error) {
        this.$toast.error(res.message)
        this.isSubmitting = false
        this.addToAnalytics(CHECKIN_PACKAGE_STATUS_FAILED)

        return false
      }

      this.addToAnalytics(res.status_checkin)

      this.isSubmitting = false
      this.iscaned = true
      if (res.status_checkin == CHECKIN_PACKAGE_STATUS_SUCCESS) {
        this.updateStatus(PACKAGE_WAREHOUSE_STATUS_PICK)
      }
      this.keyword = ''
      return true
    },

    // xác nhận thông tin đã chỉnh sửa
    async confirmHandle() {
      let payload = {
        weight: this.form.actual_weight,
        height: this.form.actual_height,
        length: this.form.actual_length,
        width: this.form.actual_width,
        id: this.current.id,
      }
      this.isCheckingRelabel = true
      const result = await this.checkRelabel(payload)
      this.isCheckingRelabel = false
      if (result.error) {
        this.$toast.error(result.message)
        return
      }

      if (result.re_label) {
        return new Promise((resolve) => {
          this.$dialog.confirm({
            title: `Xác nhận thông tin đơn hàng`,
            topIcon: true,
            iconTopClass: 'warning',
            topIconText: 're-label',
            message: `Đơn ${this.codecurrent} đã được chỉnh sửa, bạn chắn chắn thông tin chỉnh sửa là đúng?`,
            onConfirm: () => {
              resolve(true)
            },
            onCancel: () => {
              resolve(false)
            },
          })
        })
      } else {
        return new Promise((resolve) => {
          this.$dialog.confirm({
            title: `Xác nhận thông tin đơn hàng?`,
            message: `Đơn ${this.codecurrent} đã được chỉnh sửa, bạn chắn chắn thông tin chỉnh sửa là đúng?`,
            onConfirm: () => {
              resolve(true)
            },
            onCancel: () => {
              resolve(false)
            },
          })
        })
      }
    },

    reset() {
      this.form = {
        actual_weight: 0,
        actual_length: 0,
        actual_width: 0,
        actual_height: 0,
      }
    },

    showModalReturnHandle(item) {
      if (item) {
        this.setPackage(item)
      }
      this.isVisibleModalReturn = true
    },

    async returnSubmit(note) {
      if (
        this.isFetching ||
        this.isSubmitting ||
        !this.current.id ||
        note == ''
      )
        return

      this.updateVolum()
      this.isSubmitting = true
      const body = {
        ids: [this.current.id],
        checkin_request_id: this.checkinRequestId,
        note,
      }

      const res = await this.returnPackageRequest(body)

      if (res.error) {
        this.isSubmitting = false
        this.$toast.error(res.message)
        return
      }

      this.iscaned = true
      this.isSubmitting = false

      let index = this.packages.findIndex(({ id }) => id == this.current.id)
      if (index !== -1) {
        this.packages = this.packages.map((item) => {
          const obj = Object.assign({}, item)
          if (body.ids.includes(obj.id)) {
            obj.status = PACKAGE_STATUS_PENDING_PICKUP
            obj.statusHTML = '<span class="text-warning">Trả hàng</span>'
          }
          return obj
        })

        this.groups.forEach((group) => {
          group.items = group.items.map((item) => {
            const obj = Object.assign({}, item)
            if (body.ids.includes(obj.id)) {
              obj.status = PACKAGE_STATUS_PENDING_PICKUP
              obj.statusHTML = '<span class="text-warning">Trả hàng</span>'
            }
            return obj
          })
        })
      } else {
        this.addToAnalytics('returned')
      }

      this.$toast.success(`Trả hàng thành công`)
      this.isVisibleModalReturn = false
    },

    addToAnalytics(status) {
      const item = {
        id: this.current.id,
        code: this.codecurrent,
        tracking_number: !this.current.tracking
          ? ''
          : this.current.tracking.tracking_number || '',
        status,
        detail: this.current.detail,
        status_checkin: status,
        statusHTML: '<span class="text-success">Thành công</span>',
        alert: false,
        alert_icon: '',
      }

      if (status == 'returned') {
        item.status = PACKAGE_STATUS_PENDING_PICKUP
        item.statusHTML = '<span class="text-warning">Trả hàng</span>'
      }
      if (status == CHECKIN_PACKAGE_STATUS_FAILED) {
        item.statusHTML = '<span class="text-danger">Thất bại</span>'
      }

      if (status == CHECKIN_PACKAGE_STATUS_INVALID) {
        item.statusHTML = '<span class="text-invalid">Không hợp lệ</span>'
      }

      if (status == CHECKIN_PACKAGE_STATUS_UPDATE_LABEL_FAILED) {
        item.alert = 'Update label lỗi'
        item.alert_icon = 'alert'
      }

      if (status == CHECKIN_PACKAGE_STATUS_CHANGE_LABEL) {
        item.alert = 'Label đã được thay đổi'
        item.alert_icon = 'warning'
      }

      this.packages.unshift(item)

      const user = this.current.user
      const group = this.groups.find(({ id }) => id == user.id)
      if (group) {
        group.count++
        group.items.push(item)
      } else {
        this.groups.push({
          id: user.id,
          count: 1,
          name: this.customer,
          show: false,
          items: [item],
        })
      }
    },

    collapseToggle(id) {
      const idx = this.groups.findIndex((item) => item.id == id)

      if (idx === -1) return

      const show = !this.groups[idx].show
      this.$set(this.groups[idx], 'show', show)
    },

    handleValue(e) {
      this.selected = JSON.parse(JSON.stringify(e))
    },

    async handleAccepts() {
      let arrIds = this.packages
        .filter((i) => i.status_checkin == CHECKIN_PACKAGE_STATUS_FAILED)
        .map((x) => x.id)
      this.isFetching = false
      for (let id of arrIds) {
        const form = Object.assign(
          {
            id: id,
            checkin_request_id: this.checkinRequestId,
          },
          this.form
        )

        const res = await this.createLabel(form)
        if (res.error) {
          this.$toast.error(res.message)
          continue
        }
      }

      this.groups = []
      this.packages = []
      this.startHandle()
    },

    exportToCSV() {
      if (!this.groups || this.groups.length === 0) {
        this.$toast.error('Không có dữ liệu để xuất!')
        return
      }

      const headers = ['Mã đơn hàng', 'Trạng thái', 'Khách hàng', 'Chi tiết']

      const rows = this.groups.flatMap((group) => {
        return group.items.map((item) => {
          const customer = group.name
          const statusHTML = item.statusHTML
            ? item.statusHTML.replace(/<\/?[^>]+(>|$)/g, '')
            : ''
          return [item.code, statusHTML, customer, item.detail || '']
        })
      })

      let csvContent = headers.join(',') + '\n'
      rows.forEach((row) => {
        csvContent += row.join(',') + '\n'
      })

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (!this.disableBtnAccepts) {
          return 'Vẫn còn đơn thất bại, bạn có muốn thoát khỏi trang?'
        }

        return null
      }
    },

    checkSusccess(group) {
      let arrFailed = group.items.filter(
        (i) => i.status_checkin == CHECKIN_PACKAGE_STATUS_FAILED
      )
      return arrFailed.length ? 'count-danger' : 'count-success'
    },
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (!this.disableBtnAccepts) {
      const answer = window.confirm(
        'Vẫn còn đơn thất bại, bạn có muốn thoát khỏi trang?'
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
  watch: {
    isVisibleModalReturn: {
      handler: function (v) {
        if (!v) {
          this.setPackage({})
        }
      },
      deep: true,
    },
  },
}
</script>
<style>
.has-top-icon .modal-body .badge-warning {
  margin-bottom: 10px;
}

.has-top-icon .modal-body .media-body {
  color: #d46b08;
}

.has-top-icon .modal-body .media-body p {
  margin-bottom: 0;
}

.has-top-icon .modal-header .modal-title {
  color: #fa8c16 !important;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #111212;
}
</style>
