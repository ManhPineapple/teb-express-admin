<template>
  <p-modal
    class="modal-export"
    :active="visible"
    :title="`Export công nợ`"
    @close="handleClose"
  >
    <div class="row mb-16">
      <div class="col-6">
        <label for=""><b>Khách hàng:</b></label>
        <user-resource
          v-model="user_id"
          class="user-resource is-fullwidth"
          :filter="{ role: 'customer' }"
          :label="`Tìm khách hàng`"
          :search="user ? user.email : ''"
          :arr-status="this.search_status_filter"
        />
      </div>
      <div class="col-6">
        <label for=""><b>Trạng thái đơn hàng:</b></label>
        <multiselect
          placeholder="Chọn trạng thái"
          v-model="status"
          label="text"
          track-by="value"
          :options="options"
          :multiple="true"
          :allow-empty="true"
        ></multiselect>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-6 jc-sb">
        <label for=""><b>Từ ngày:</b></label>
        <br />
        <p-datepicker
          class="date"
          :format="'dd/mm/yyyy'"
          :label="labelStart"
          :value="{
            startDate: start_date,
          }"
          :auto-apply="true"
          @update="selectStartDate"
          :single-date-picker="true"
          :opens="'center'"
        >
        </p-datepicker>
      </div>
      <div class="col-6">
        <label for=""><b>Đến ngày:</b></label>
        <br />
        <p-datepicker
          class="date"
          :format="'dd/mm/yyyy'"
          :minDate="start_date"
          :label="labelEnd"
          :value="{
            endDate: end_date,
          }"
          :auto-apply="true"
          @update="selectEndDate"
          :single-date-picker="true"
          :opens="'center'"
        >
        </p-datepicker>
      </div>
    </div>
    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleExport" :loading="loading">
          Export
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import UserResource from '@/components/shared/resource/UsersActive'
import { date } from '@core/utils/datetime'
import { USER_STATUS_ACTIVE, USER_STATUS_DEACTIVE } from '../constants'
export default {
  name: 'ModalExport',
  components: { UserResource },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      user_id: 0,
      status: '',
      start_date: '',
      end_date: '',
      labelStart: 'Chọn ngày tạo hóa đơn',
      labelEnd: 'Chọn ngày tạo hóa đơn',
      search_status_filter: `${USER_STATUS_ACTIVE},${USER_STATUS_DEACTIVE}`,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
    validateParams() {
      if (this.status.length == 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn trạng thái !',
        })
        return false
      }

      if (this.start_date != '' && this.end_date == '') {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn ngày kết thúc !',
        })
        return false
      }

      return true
    },

    selectStartDate(v) {
      this.start_date = v.startDate
      this.end_date = this.start_date
    },
    selectEndDate(v) {
      this.end_date = v.endDate
      if (this.start_date == '') {
        this.start_date = this.end_date
      }
    },
    async handleExport() {
      if (!this.validateParams()) {
        return
      }

      const payload = {
        user_id: this.user_id,
        status: this.status.map((x) => x.value),
        start_date: date(this.start_date, 'yyyy-MM-dd'),
        end_date: date(this.end_date, 'yyyy-MM-dd'),
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.user_id = 0
        this.status = ''
        this.start_date = ''
        this.end_date = ''
        this.labelStart = 'Chọn ngày tạo hóa đơn'
        this.labelEnd = 'Chọn ngày tạo hóa đơn'
      },
    },
  },
}
</script>
<style>
.modal-export .modal-footer {
  justify-content: flex-end !important;
}
.modal-export .p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
