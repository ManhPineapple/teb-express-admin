<template>
  <div class="claim-reply">
    <div class="card">
      <div class="reply-form">
        <div class="form-upload">
          <p-tooltip
            :label="'Đính kèm file'"
            size="large"
            position="top"
            type="dark"
            :active="true"
          >
            <upload
              class="file-uploader"
              :action="uploadFileEndpoint"
              drag
              list-type="picture"
              :headers="uploadHeaders"
              @e-change="onChange"
              :on-change="handleChangeFile"
              multiple
              :auto-upload="false"
              :on-max-size="errorMaximum"
              :max-file-size="maximumSize"
            >
              <p-svg name="attachment"></p-svg>
            </upload>
          </p-tooltip>
        </div>
        <textarea
          class="form-control"
          :class="{ error: !!messageError }"
          v-model="message"
          placeholder="Nhập lời nhắn ..."
        ></textarea>
        <p-button type="info" @click="sendHandle" :loading="isUploading">
          Gửi trả lời
        </p-button>
      </div>
      <p class="invalid-error" v-if="messageError">{{ messageError }}</p>
      <p class="rule"
        >* Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung lượng dưới
        5Mb</p
      >

      <div class="attachments">
        <div v-if="fileErrors.length > 0" class="ticket__error mb-16">
          <div class="ticket__error-title">
            <p-svg class="ticket__error-icon" name="alert"></p-svg>
            <span>Tệp tin chưa được thêm vào:</span>
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
        <div v-if="files != null" class="mt-3 ticket__reply-files mb-16">
          <div
            class="el-before-upload__filename d-flex justify-content-between"
            v-for="(item, i) in files"
            :key="i"
          >
            <div class="filename mr-3">{{ item.name }}</div>
            <div :class="{ isUpload: isUploading }" class="remove-file">
              <span class="icon-remove" @click.prevent="actionDeleteFile(item)">
                <p-svg name="x-sm"></p-svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'
import mixinUpload from '@core/mixins/upload'
import { Upload } from '@kit'
import { UPDATE_FILE_TICKET, PUSH_MESSAGE } from '@/packages/claim/store'
import { MAXIMUM_SIZE } from '../constants'

export default {
  name: 'FormReply',
  mixins: [mixinUpload],
  components: { Upload },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    claim: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      maximumSize: MAXIMUM_SIZE * 2 ** 20,
      allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      allowedExtensions: /(\.jpg|\.jpeg|\.png|\.xlsx|\.xls)$/i,
      files: [],
      fileErrors: [],
      message: '',
      messageError: '',
      isUploading: false,
      countIsUploading: 0,
    }
  },
  methods: {
    ...mapActions('claim', {
      ticketUpload: UPDATE_FILE_TICKET,
      reply: PUSH_MESSAGE,
    }),
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleAction() {
      this.$emit('action')
    },
    onChange(files) {
      this.fileErrors = []
      this.countIsUploading += files.length || 0
    },
    handleChangeFile(file) {
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index !== -1) {
        this.$set(this.files, index, file)
      }

      if (this.validateTypeFile(file)) {
        this.handleUploadFile(file)
        return
      }

      this.countIsUploading--
      this.fileErrors.push(
        `"${file.name}" định dạng không đúng.Tệp phải có định dạng:  *XLSX, *PNG, *JPG, *JPEG.`
      )

      this.fileErrors = [...new Set(this.fileErrors)]
      return
    },
    async handleUploadFile(file) {
      let body = { file: file.raw }

      this.isUploading = true
      const res = await this.ticketUpload(body)

      this.countIsUploading--
      if (this.countIsUploading < 1) {
        this.isUploading = false
      }

      if (res.error) {
        this.fileErrors.push(res.message)
        return
      }

      this.files.push({
        url: res.urls,
        uid: file.uid,
        name: file.name,
      })
    },
    validateTypeFile(file) {
      if (this.allowedExtensions.exec(file.name)) {
        return true
      }

      if (this.allowedTypes.includes(file.raw.type)) {
        return true
      }

      return false
    },
    actionDeleteFile(file) {
      this.$dialog.confirm({
        title: 'Xóa files',
        message: 'Bạn có thực sự muốn xóa file này ?',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        onConfirm: () => {
          this.files = this.files.filter(({ uid }) => uid != file.uid)
        },
      })
    },
    validate() {
      if (this.message == '') {
        this.messageError = 'Nội dung không được để trống'
        return false
      }

      if (this.message.length > 1000) {
        this.messageError = `Nội dung vượt quá 1000 ký tự`
        return false
      }

      this.messageError = ''
      return true
    },
    onValidate: debounce(async function () {
      this.validate()
    }, 100),
    async sendHandle() {
      if (this.isUploading || !this.validate()) return

      const urls = this.files.map(({ url }) => url)
      const form = {
        ticket_id: this.claim.id,
        content: this.message,
        urls: urls || [],
      }

      this.isUploading = true
      const res = await this.reply(form)
      this.isUploading = false

      if (!res.success) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Trả lời thành công')
      this.message = ''
      this.messageError = ''
      this.files = []
      this.fileErrors = []
      this.$emit('success', res.reply)
    },
    errorMaximum({ name }) {
      this.countIsUploading--
      this.fileErrors.push(
        `"${name}" đang lớn hơn 5Mb.Vui lòng chọn tệp nhỏ hơn.`
      )
    },
  },
  watch: {
    message: function (value) {
      value && this.onValidate()
    },
  },
}
</script>
