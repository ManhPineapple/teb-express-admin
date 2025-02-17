<template>
  <p-modal
    class="modal-export"
    :active="visible"
    :title="`Export đơn AU chưa có tracking`"
    @close="handleClose"
  >
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
import { date } from '@core/utils/datetime'
export default {
  name: 'ModalExportPackage',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      start_date: '',
      end_date: '',
      labelStart: 'Chọn ngày tạo mã LB',
      labelEnd: 'Chọn ngày tạo mã LB',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
    validateParams() {
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
        start_date: date(this.start_date, 'yyyy-MM-dd'),
        end_date: date(this.end_date, 'yyyy-MM-dd'),
      }
      this.$emit('export', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.start_date = ''
        this.end_date = ''
        this.labelStart = 'Chọn ngày tạo mã LB'
        this.labelEnd = 'Chọn ngày tạo mã LB'
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
