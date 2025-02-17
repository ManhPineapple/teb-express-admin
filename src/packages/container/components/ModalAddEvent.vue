<template>
  <p-modal :active="visible" title="Thêm hành trình" @close="handleClose">
    <template>
      <div class="d-flex ce-add-types">
        <label>
          <input type="radio" v-model="add_type" value="single" />
          <span>Thêm thủ công</span>
        </label>
        <label>
          <input type="radio" v-model="add_type" value="file" />
          <span>Nhập excel</span>
        </label>
      </div>
      <div class="row mt-3 event-form" v-if="add_type === 'single'">
        <div class="col-6 mb-3">
          <label>Thời gian: <span>*</span></label>
          <p-datepicker
            :label="'Chọn thời gian'"
            :single-date-picker="true"
            class="p-input-group input-group"
            :locale-data="{ format: 'dd-mm-yyyy HH:mm:ss' }"
            :time-picker="true"
            :show-dropdowns="true"
            :time-picker-increment="1"
            v-model="datetime"
          ></p-datepicker>
          <span class="invalid-error" v-if="!!errDatetime">{{
            errDatetime
          }}</span>
        </div>
        <div class="col-6 mb-3">
          <label>Địa điểm nhận hàng: <span>*</span></label>
          <p-input
            type="text"
            v-model.trim="location"
            placeholder="Nhập địa điểm kiện hàng"
            :class="{ 'has-error': !!errLocation }"
          ></p-input>
          <span class="invalid-error" v-if="!!errLocation">{{
            errLocation
          }}</span>
        </div>
        <div class="col-12 mb-3">
          <label>Mã kiện hàng: <span>*</span></label>
          <p-input
            type="text"
            v-model.trim="code"
            placeholder="Nhập mã kiện hàng"
            :class="{ 'has-error': !!errCode }"
          ></p-input>
          <span class="invalid-error" v-if="!!errCode">{{ errCode }}</span>
        </div>
        <div class="col-12">
          <label>Nội dung: <span>*</span></label>
          <textarea
            v-model.trim="description"
            class="form-control"
            placeholder="Nhập nội dung"
            :class="{ 'has-error': !!errDescription }"
          ></textarea>
          <span class="invalid-error" v-if="!!errDescription">{{
            errDescription
          }}</span>
        </div>
      </div>
      <div class="event-file mt-3" v-else>
        <p
          >Download a
          <a :href="urlTemplateImport" target="_blank">sample excel template</a>
          to see an example of the format required.</p
        >
        <upload
          :drag="true"
          :accept="'.csv,.xlsx,.xlsm,.xls'"
          :multiple="false"
          :on-change="onChangeFile"
          :auto-upload="false"
          action=""
        >
          <p-svg name="upload" class="el-icon-upload"></p-svg>
          <div class="el-upload__text"
            >Kéo thả file để upload, hoặc <em>tải lên</em></div
          >
          <div class="el-before-upload__text">
            {{ file ? file.name : 'Chưa có file nào được chọn' }}
          </div>
        </upload>
        <span class="invalid-error" v-if="!!errFile">{{ errFile }}</span>
        <span
          class="invalid-error"
          v-for="item in errResult"
          :key="item.line"
          >{{ `${item.code}: ${item.errors.join(', ')}` }}</span
        >
        <p class="upload-tip"
          >Chúng tôi chỉ chấp nhận file dưới 5MB và có định dạng CSV, EXCEL</p
        >
      </div>
    </template>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-update">
        <p-button type="default" @click="handleClose" :disabled="isSubmitting"
          >Bỏ qua</p-button
        >
        <p-button
          type="info"
          :loading="loading"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          Thêm hành trình
        </p-button>
      </div>
    </template>
  </p-modal>
</template>
<script>
import { mapActions } from 'vuex'
import Upload from '../../../kit/Upload/Index'
import { CREATE_CONTAINER_EVENT, IMPORT_CONTAINER_EVENT } from '../store'

const MAX_SIZE_FILE_UPLOAD = 5 * 1024 * 1024

export default {
  name: 'ModalAddEvent',
  components: { Upload },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tracking: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSubmitting: false,
      add_type: 'single',
      code: '',
      datetime: '',
      location: '',
      description: '',
      errCode: '',
      errDatetime: '',
      errLocation: '',
      errDescription: '',
      file: null,
      errFile: '',
      errResult: [],
      urlTemplateImport: `${process.env.VUE_APP_ASSETS}/lionbay-template-container-event.xlsx`,
    }
  },
  methods: {
    ...mapActions('container', {
      createEvent: CREATE_CONTAINER_EVENT,
      importEvent: IMPORT_CONTAINER_EVENT,
    }),
    handleClose() {
      this.reset()
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      if (this.add_type === 'single') {
        this.handleCreate()
        return
      }

      this.handleImport()
    },
    async handleCreate() {
      if (this.isSubmitting) return
      this.clear()

      let isValid = true
      if (this.code == '') {
        this.errCode = 'Mã kiện hàng là bắt buộc'
        isValid = false
      }

      if (!this.datetime || !this.datetime.startDate) {
        this.errDatetime = 'Thời gian là bắt buộc'
        isValid = false
      }

      if (this.location == '') {
        this.errLocation = 'Địa điểm là bắt buộc'
        isValid = false
      }

      if (this.location.length > 100) {
        this.errLocation = 'Địa điểm không quá 100 ký tự'
        isValid = false
      }

      if (this.description == '') {
        this.errDescription = 'Nội dung là bắt buộc'
        isValid = false
      }

      if (this.description.length > 150) {
        this.errDescription = 'Nội dung không quá 150 ký tự'
        isValid = false
      }

      if (!isValid) return

      const payload = {
        code: this.code,
        location: this.location,
        datetime: this.datetime.startDate,
        description: this.description,
      }

      this.isSubmitting = true
      const res = await this.createEvent(payload)
      this.isSubmitting = false

      if (!res.success) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Tạo hành trình kiện hàng thành công')
      this.reset()
      this.handleClose()
    },
    async handleImport() {
      if (this.isSubmitting) return
      this.clear()

      if (this.file == null) {
        this.errFile = 'File là bắt buộc'
        return
      }

      const ext = this.file.name.split('.').pop()
      if (!['csv', 'xlsx', 'xlsm', 'xls'].includes(ext)) {
        this.errFile = 'File không đúng định dạng'
        return
      }

      if (this.file.raw.size > MAX_SIZE_FILE_UPLOAD) {
        this.errFile = 'Dung lượng file không quá 5MB'
        return
      }

      const form = new FormData()
      form.append('file', this.file.raw)

      this.isSubmitting = true
      const res = await this.importEvent(form)
      this.isSubmitting = false

      if (!res.success) {
        this.$toast.error(res.message)
        this.errResult = res.errors || []
        if (this.errResult.length > 3) {
          this.errResult.length = 3
        }
        return
      }

      this.$toast.success('Import hành trình kiện hàng thành công')
      this.reset()
      this.handleClose()
    },
    onChangeFile(file) {
      this.clear()
      this.file = file
    },
    clear() {
      this.errCode = ''
      this.errDatetime = ''
      this.errLocation = ''
      this.errDescription = ''
      this.errFile = ''
      this.errResult = []
    },
    reset() {
      this.add_type = 'single'
      this.code = ''
      this.datetime = ''
      this.location = ''
      this.description = ''
      this.errCode = ''
      this.errDatetime = ''
      this.errLocation = ''
      this.errDescription = ''
      this.file = null
      this.errFile = ''
      this.errResult = []
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.ups_tracking = this.tracking
      },
    },
  },
}
</script>
<style lang="scss">
.ce-add-types {
  label {
    span {
      margin-left: 5px;
      vertical-align: text-bottom;
    }

    + label {
      margin-left: 50px;
    }
  }
}

.event-form {
  label {
    span {
      color: #f5222d;
    }
  }
}

.upload-tip {
  font-size: 12px;
  color: #6f6f6f;
}
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
.p-modal-content {
  z-index: 99;
  overflow: unset;
}

.modal-body {
  overflow: unset;
}
</style>
