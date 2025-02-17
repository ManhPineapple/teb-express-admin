<template>
  <div class="pages setting-point-page">
    <div class="page-header">
      <div class="setting-point">
        <div class="input-setting d-flex justify-content-between">
          <div style="margin-right: 24px">
            <label>Giá vận đơn</label>
            <div class="d-flex justify-content-between">
              <p-input
                type="number"
                placeholder="Từ"
                v-model.number="form.from"
                :error="valider.error('from')"
                style="margin-right: 8px"
              />
              <span style="padding-top: 10px">-</span>
              <p-input
                type="number"
                placeholder="Đến"
                v-model.number="form.to"
                :error="valider.error('to')"
                style="margin-left: 8px"
              />
            </div>
          </div>
          <div style="min-width: 237px; margin-right: 24px">
            <label>Hạng</label>
            <multiselect
              placeholder="Chọn hạng"
              label="text"
              track-by="value"
              :options="types"
              v-model="form.class"
              :class="{ error: valider.error('class') }"
            >
            </multiselect>
            <span class="invalid-error" v-if="valider.error('class')">{{
              valider.error('class')
            }}</span>
          </div>
          <div style="margin-right: 24px; min-width: 200px">
            <label>Phần trăm quy đổi điểm</label>
            <p-input
              type="number"
              placeholder="Nhập % quy đổi điểm"
              v-model.number="form.value"
              :error="valider.error('value')"
            />
          </div>
          <div style="padding-top: 30px">
            <p-button
              class="btn btn-info"
              style="border-radius: 8px; width: 96px"
              @click="createSettingPointHanlder"
            >
              Thêm mốc
            </p-button>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="setting-point">
        <div class="list-content mt-24 mb-40">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="settings.length > 0">
            <div
              class="table-responsive"
              v-for="(type, index) in types"
              :key="index"
            >
              <table
                class="table table-hover mb-24"
                v-if="getGroup(type.value).length"
              >
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Giá vận đơn từ:</th>
                    <th>Đến:</th>
                    <th colspan="2">Phần trăm quy đổi điểm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in getGroup(type.value)" :key="i">
                    <td
                      width="150"
                      :rowspan="getGroup(type.value).length"
                      v-if="!i"
                    >
                      <b>{{ type.text }}</b>
                    </td>
                    <td width="270">{{ item.from | formatPrice }}</td>
                    <td width="270">{{ item.to | formatPrice }}</td>
                    <td>{{ item.value }}%</td>
                    <td width="100" class="text-center">
                      <a @click.prevent="showModalEdit(item)">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          createSettingPoint
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.59967 4.56953L11.4281 7.39792L4.82843 13.9976H2V11.1692L8.59967 4.56953ZM9.54247 3.62672L10.9567 2.2125C11.2171 1.95216 11.6391 1.95216 11.8995 2.2125L13.7851 4.09812C14.0455 4.35847 14.0455 4.78058 13.7851 5.04093L12.3709 6.45514L9.54247 3.62672Z"
                            fill="#4F5050"
                          />
                        </svg>
                      </a>
                      <a @click.prevent="confirmDelete(item)">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.3333 3.99998H14.6666V5.33331H13.3333V14C13.3333 14.3682 13.0348 14.6666 12.6666 14.6666H3.33325C2.96507 14.6666 2.66659 14.3682 2.66659 14V5.33331H1.33325V3.99998H4.66658V1.99998C4.66658 1.63179 4.96507 1.33331 5.33325 1.33331H10.6666C11.0348 1.33331 11.3333 1.63179 11.3333 1.99998V3.99998ZM5.99992 7.33331V11.3333H7.33325V7.33331H5.99992ZM8.66658 7.33331V11.3333H9.99992V7.33331H8.66658ZM5.99992 2.66665V3.99998H9.99992V2.66665H5.99992Z"
                            fill="#4F5050"
                          />
                        </svg>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <EmptySearchResult v-else></EmptySearchResult>
        </div>
      </div>
    </div>
    <modal-edit-setting-point
      :visible.sync="isVisibleModalEdit"
      :setting="setting"
      :loading="isSubmitting"
      @save="handleUpdateSetting"
    >
    </modal-edit-setting-point>
  </div>
</template>
<script>
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import valider from '@core/valider'
import {
  FETCH_SETTING_POINT,
  CREATE_SETTING_POINT,
  UPDATE_SETTING_POINT,
} from '../store/index'
import { mapState, mapActions } from 'vuex'
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import ModalEditSettingPoint from '../components/ModalEditSettingPoint'
import { groupBy } from '@core/utils/formatter'
import {
  USER_CLASS_PARTNER,
  USER_CLASS_PRIORITY,
  USER_CLASS_PUBLIC,
  SETTING_STATUS_DISABLE,
} from '../constants'
export default {
  name: 'SettingPoint',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalEditSettingPoint,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 0,
      },
      isFetching: false,
      isSubmitting: false,
      isVisibleModalEdit: false,
      form: {
        from: null,
        to: null,
        class: null,
        value: null,
      },
      valider: null,
      setting: null,
      errs: [],
      types: [
        {
          text: 'Public',
          value: USER_CLASS_PUBLIC,
        },
        {
          text: 'Priority',
          value: USER_CLASS_PRIORITY,
        },
        {
          text: 'Partner',
          value: USER_CLASS_PARTNER,
        },
      ],
    }
  },
  created() {
    this.valider = valider.schema((y) => ({
      from: y
        .number()
        .min(0, 'Giới hạn không hợp lệ')
        .typeError('Giới hạn không hợp lệ'),
      to: y
        .number()
        .positive('Giới hạn không hợp lệ')
        .typeError('Giới hạn không hợp lệ'),
      class: y
        .number()
        .positive('Chưa chọn hạng')
        .typeError('Chưa chọn hạng !'),
      value: y
        .number()
        .min(0, 'Điểm không hợp lệ')
        .typeError('Điểm quy đổi bắt buộc nhập !'),
    }))
    this.valider.reset()
    this.filter = this.getRouteQuery()
    this.init()
  },
  computed: {
    ...mapState('setting', {
      settings: (state) => state.settingPoint,
      count: (state) => state.countSettingPoint,
    }),
  },
  methods: {
    ...mapActions('setting', [
      FETCH_SETTING_POINT,
      CREATE_SETTING_POINT,
      UPDATE_SETTING_POINT,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_SETTING_POINT](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ type: 'danger', message: result.message })
      }
    },
    getGroup(pID) {
      const grouped = groupBy(this.settings, (item) => item.class)
      return grouped.get(pID) || []
    },
    confirmDelete(item) {
      this.$dialog.confirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn xóa ?',
        confirmText: 'Xóa',
        cancelText: 'Bỏ qua',
        onConfirm: () => this.deleteHanlde(item),
      })
    },
    async deleteHanlde(payload) {
      payload.status = SETTING_STATUS_DISABLE
      this.isSubmitting = true
      let result = await this[UPDATE_SETTING_POINT](payload)
      this.isSubmitting = false
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Xoá mốc tích điểm thành công !',
      })
      this.init()
    },
    showModalEdit(item) {
      this.setting = item
      this.isVisibleModalEdit = true
    },
    async createSettingPointHanlder() {
      let data = {
        from: this.form.from,
        to: this.form.to,
        class: this.form.class ? this.form.class.value : null,
        value: this.form.value,
      }
      if (!this.valider.check(data)) {
        return
      }
      this.isSubmitting = true
      let result = await this[CREATE_SETTING_POINT](data)
      this.isSubmitting = false
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Tạo mốc tích điểm thành công!',
      })
      this.form = {
        from: null,
        to: null,
        class: null,
        value: null,
      }
      this.init()
    },
    async handleUpdateSetting(payload) {
      this.isSubmitting = true
      let result = await this[UPDATE_SETTING_POINT](payload)
      this.isSubmitting = false
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật mốc tích điểm thành công!',
      })
      this.isVisibleModalEdit = false
      this.init()
    },
  },
  watch: {
    filter: {
      handler: function () {},
      deep: true,
    },
  },
}
</script>
