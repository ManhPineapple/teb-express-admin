<template>
  <p-modal :active="visible" :title="`Thêm hành trình`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-6">
        <label for=""
          ><b>Thời gian:</b>&ensp;<span style="color: red">*</span></label
        >
        <p-datepicker
          :label="'Chọn thời gian'"
          :single-date-picker="true"
          class="p-input-group input-group"
          :locale-data="{ format: 'dd-mm-yyyy HH:mm:ss' }"
          :time-picker="true"
          :show-dropdowns="true"
          :time-picker-increment="1"
          v-model="time"
        ></p-datepicker>
      </div>
      <div class="col-6">
        <label for=""
          ><b>Địa điểm đơn hàng:</b>&ensp;<span style="color: red">*</span>
        </label>
        <p-input type="text" v-model="location"></p-input>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <label for=""
          ><b>Nội dung:</b>&ensp;<span style="color: red">*</span></label
        >
        <textarea
          class="form-control"
          rows="4"
          v-model="description"
        ></textarea>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleSave" :loading="loading">
          Tạo
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalCreateTracking',
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
      description: '',
      location: '',
      time: '',
    }
  },
  async created() {},
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      let payload = {
        time: this.time.startDate,
        location: this.location,
        description: this.description,
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.description = ''
        this.location = ''
        this.time = ''
      },
    },
  },
}
</script>
<style>
.reportrange-text {
  line-height: 30px;
}
.daterangepicker .calendars .calendar-table {
  height: auto !important;
}
.form-control.hourselect,
.form-control.minuteselect {
  text-align: center;
  height: auto !important;
  position: unset;
  left: unset;
  top: unset;
  background: unset;
  border: unset;
  box-sizing: unset;
  border-radius: unset !important;
  font-size: unset;
  box-shadow: none;
  transition: unset;
  padding: unset;
  color: unset;
}
</style>
