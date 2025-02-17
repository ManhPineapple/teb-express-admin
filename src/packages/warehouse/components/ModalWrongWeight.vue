<template>
  <p-modal
    class="modal-export"
    :active="visible"
    :title="`Xuất hàng lệch cân`"
    @close="handleClose"
    :close-outside="true"
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
    <user-resource
      id="search"
      v-model="userInfo"
      class="user-resource is-fullwidth"
      :filter="{ role: 'customer' }"
      :search="keywordSearch"
      :label="`Tìm khách hàng`"
      :emitID="false"
      :is-tester="isTester"
    />
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
import UserResource from '@/components/shared/resource/AllUser.vue'
export default {
  name: 'ModalWrongWeight',
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
  },
  data() {
    return {
      keywordSearch: '',
      userInfo: null,
      start_date: '',
      end_date: '',
      labelStart: 'Chọn ngày bắt đầu',
      labelEnd: 'Chọn ngày kết thúc',
      isTester: this.$route.query.tester
        ? parseInt(this.$route.query.tester)
        : 0,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateParams() {
      if (this.start_date != '' && this.end_date != '') {
        const time = this.end_date.getTime() - this.start_date.getTime()
        const diff_days = Math.floor(time / (1000 * 3600 * 24))
        if (diff_days > 31) {
          this.$toast.error('Khoảng tìm kiếm chỉ trong vòng 30 ngày')
          return false
        }
      }

      if (this.start_date == '' || this.end_date == '') {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn ngày !',
        })
        return false
      }
      if (this.userInfo === null) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn khách hàng !',
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
        full_name: this.userInfo.full_name,
      }
      this.$emit('export', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.userInfo = null
        this.start_date = ''
        this.end_date = ''
        this.labelStart = 'Chọn ngày bắt đầu'
        this.labelEnd = 'Chọn ngày kết thúc'
      },
    },
  },
}
</script>
<style>
.modal-footer {
  justify-content: flex-end !important;
}
.p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
