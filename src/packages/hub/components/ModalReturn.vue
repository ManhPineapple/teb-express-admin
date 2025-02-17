<template>
  <p-modal
    class="modal-return"
    :active="visible"
    :title="title"
    @close="handleClose"
    :close-outside="true"
  >
    <div class="mb-16 form-group">
      <label class="form-label"
        >Lý do trả hàng: <span class="text-danger">*</span></label
      >
      <select v-model="reason" class="form-control">
        <option v-for="(item, i) in reasons" :key="i" :value="item.text">
          {{ item.text }}
        </option>
      </select>
      <span class="invalid-error" v-if="validErrors.reason">
        {{ validErrors.reason }}
      </span>
    </div>

    <div class="mb-16">
      <label class="form-label">Nguyên nhân:</label>
      <input
        v-model="content"
        class="floating p-select form-control"
        placeholder="Nhập nguyên nhân"
      />
      <span class="invalid-error" v-if="validErrors.content">{{
        validErrors.content
      }}</span>
    </div>

    <div class="mb-0">
      <label class="form-label">Bằng chứng:</label>
      <div class="upload_file">
        <div v-if="!isReturned">
          <upload
            class="file-uploader"
            :action="uploadEndpoint"
            drag
            :accept="acceptUpload"
            list-type="picture"
            :headers="uploadHeaders"
            @e-change="listenChange"
            :on-change="onChange"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :on-exceed="onLimit"
            multiple
            :auto-upload="true"
            :on-max-size="errorMaximum"
            :max-file-size="maximumSize"
            :before-upload="onBeforeUpload"
            :data="{ type: 'return_packages' }"
          >
            <div class="el-upload__text">
              <p-svg name="upload_img"></p-svg>
              <span>Tải ảnh lên</span>
            </div>
          </upload>
          <div class="rule mb-16">
            Chúng tôi chỉ chấp nhận file dưới 5MB và có các định dạng sau: CSV,
            XLSX, PNG, JPG, JPEG
          </div>
          <span class="invalid-error" v-if="validErrors.files">
            {{ validErrors.files }}
          </span>
        </div>

        <div v-if="fileErrors.length > 0" class="ticket__error w-100 mb-3">
          <div class="ticket__error-title">
            <span class="ticket__error-icon">
              <p-svg name="alert"></p-svg>
            </span>
            <span>Tệp tin lỗi:</span>
          </div>
          <ul class="ticket__error-list">
            <li
              v-for="(item, i) in fileErrors"
              :key="i"
              class="ticket__error-item"
            >
              {{ item }}</li
            >
          </ul>
        </div>

        <div class="files">
          <div class="file-item" v-for="item in urls" :key="item">
            <File :src="item" />
            <div class="remove-file">
              <span class="icon-remove" @click.prevent="actionDeleteFile(item)">
                <p-svg name="x-sm"></p-svg>
              </span>
            </div>
          </div>
          <div class="file-item" v-for="item in files" :key="item.uid">
            <File :src="item.src" />
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <!--      <div>-->
      <!--        <p-svg name="InfoCircle"></p-svg>-->
      <!--        <b>Lưu ý:</b> (<span class="text-danger">*</span>)-->
      <!--        <i>Là các trường bắt buộc nhập.</i>-->
      <!--      </div>-->
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">Hủy</p-button>
        <p-button
          type="info"
          @click.prevent="submitHandle"
          :disabled="disableSubmit || urls.length > 5"
          >Xác nhận</p-button
        >
      </div>
    </template>
  </p-modal>
</template>

<script>
import mixinUpload from '@core/mixins/upload'
import {
  MAXIMUM_SIZE,
  ALLOW_MIME_TYPE_FILE_RETURN,
  REGEX_ALLOW_FILE_RETURN_EXTENSION,
} from '../constants'
import { Upload } from '@kit'
import File from './File'
import { noop } from '@/core/utils'

export default {
  name: 'ModalReturn',
  mixins: [mixinUpload],
  components: { Upload, File },
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
    submit: {
      type: Function,
      default: noop,
    },
    current: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    displayErrors() {
      return [...new Set(this.fileErrors)]
    },
    title() {
      return `Lý do`
    },
    isReturned() {
      return this.current.package_return && this.current.package_return.id > 0
    },
    acceptUpload() {
      return ALLOW_MIME_TYPE_FILE_RETURN.join(',')
    },
    disableSubmit() {
      const returnId = this.current.package_return
        ? this.current.package_return.id
        : 0
      return returnId > 0 || this.files.length > 0
    },
  },
  data() {
    return {
      maximumSize: MAXIMUM_SIZE,
      fileErrors: [],
      files: [],
      urls: [],
      reason: 'Sai địa chỉ',
      content: '',
      errors: {},
      reasons: [
        {
          text: 'Sai địa chỉ',
          value: 'A',
        },
        {
          text: 'Hàng hư hỏng',
          value: 'B',
        },
        {
          text: 'Khác',
          value: 'C',
        },
      ],
      validErrors: {},
      isSubmitting: false,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    onChange(e, fileList) {
      if (!this.validFile(e.raw)) return

      const exists = this.files.some(({ uid }) => uid == e.uid)
      if (exists || e.status == 'success') return

      if (fileList.length > 5) {
        this.onLimit()
      }

      if (this.urls.length + this.files.length >= 5) {
        this.onLimit()
        return
      }

      this.files.push(e)
      this.files = this.files.filter(
        ({ status }) => !['fail', 'success'].includes(status)
      )
    },
    onLimit() {
      this.$set(this.validErrors, 'files', 'Tối đa chỉ được 5 files đính kèm')
    },
    onUploadSuccess(e, file, fileList) {
      setTimeout(() => {
        fileList.splice(fileList.indexOf(file), 1)

        const idx = this.files.findIndex(({ uid }) => uid == file.uid)
        if (e && e.url && idx !== -1) {
          this.urls.push(e.url)
          this.files = this.files.filter(({ uid }) => uid != file.uid)
        }
      }, 300)
    },
    onUploadError(e, file) {
      if (!e || !e.error) return

      this.fileErrors.push(`"${file.name}" %${e.error}`)
    },
    errorMaximum({ name }) {
      this.fileErrors.push(`"${name}" vượt quá dung lượng`)
    },
    listenChange() {
      this.fileErrors = []
    },
    validFile({ name, type }) {
      if (!ALLOW_MIME_TYPE_FILE_RETURN.includes(type)) {
        return false
      }

      if (!REGEX_ALLOW_FILE_RETURN_EXTENSION.exec(name)) {
        return false
      }

      return true
    },
    onBeforeUpload(file) {
      if (!this.validFile(file)) {
        this.fileErrors.push(`"${file.name}" định dạng không đúng`)
        return false
      }

      return true
    },
    actionDeleteFile(item) {
      this.$dialog.confirm({
        title: `Bạn có muốn xóa file?`,
        onConfirm: () => {
          this.urls = this.urls.filter((v) => v != item)
          this.$set(this.validErrors, 'files', '')
        },
      })
    },
    async submitHandle() {
      if (
        !this.validate() ||
        this.isSubmitting ||
        !this.current ||
        !this.current.id ||
        this.files.length > 0
      )
        return

      this.isSubmitting = true

      const payload = {
        package_id: this.current.id,
        reason: this.reason,
        content: this.content,
        images: this.urls,
      }

      const result = await this.submit(payload)
      if (result) {
        this.reason = 'Sai đia chỉ'
        this.content = ''
        this.urls = []
      }

      this.isSubmitting = false
    },
    validate() {
      this.validErrors = {}
      if (!this.reason) {
        this.$set(
          this.validErrors,
          'reason',
          'Lý do trả hàng không được để trống'
        )
      }

      return Object.keys(this.validErrors).length == 0
    },
  },
  watch: {
    current: {
      handler: function (val) {
        this.content = ''
        this.urls = []
        if (!val.package_return || !val.package_return.id) return

        const { reason, content, images } = val.package_return

        this.reason = reason
        this.content = content
        this.urls = images
      },
      deep: true,
    },
    visible: {
      handler: function (val) {
        if (!val) {
          this.reason = 'Sai địa chỉ'
          this.content = ''
          this.urls = []
        }
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.files {
  margin-left: -6px;
  margin-right: -6px;
  overflow: hidden;

  &:after {
    content: '';
    clear: both;
  }
}
.file-item {
  width: 64px;
  height: 64px;
  position: relative;
  margin: 6px;
  float: left;

  .remove-file {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;

    .icon-remove {
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 11px;
      display: block;
      cursor: pointer;
    }

    path {
      stroke: #111212;
    }
  }
}
.modal-body {
  max-height: 100vh;
}

.el-upload__text {
  text-align: center;
  margin-top: 40px;

  span {
    display: block;
    color: #cfd0d0;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
<style>
.modal-return .el-upload-dragger {
  height: 128px;
}
</style>
