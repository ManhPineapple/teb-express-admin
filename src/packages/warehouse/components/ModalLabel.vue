<template>
  <p-modal
    class="modal-export"
    :active="visible"
    :title="`Tạo Labels PDF`"
    @close="handleClose"
    :close-outside="true"
  >
    <div class="modal-body">
      <div class="form-group" v-if="!importting">
        <p-upload v-model="file" :accept="accept">
          <div class="btn btn-primary">
            <div class="upload">
              <svgicon name="import-excel"></svgicon>
              <span class="ml-10">Chọn file</span>
            </div>
          </div>
        </p-upload>
        <span class="ml-10" v-if="!file">
          Không có tập tin nào được chọn
        </span>
        <span class="ml-10" v-else>{{ file.name }}</span>
      </div>
    </div>
    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleSubmit" :loading="importting">
          Import
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { IMPORT_CREATE_LABEL_PDF } from '../store'
import { mapActions } from 'vuex'

export default {
  name: 'ModalLabelPDF',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: null,
      importting: false,
      accept: '.xlsx',
      errorMessages: [],
    }
  },
  methods: {
    ...mapActions('warehouse', {
      import: IMPORT_CREATE_LABEL_PDF,
    }),

    handleClose() {
      this.$emit('update:visible', false)
    },

    async handleSubmit() {
      if (this.importting) return

      this.importting = true
      const playload = { file: this.file }
      const res = await this.import(playload)
      this.importting = false
      if (!res || res.error) {
        this.file = null
        this.$toast.error(res.message)
        return
      }

      this.$toast.success(
        `Yêu cầu của bạn đang được xử lý. Chúng tôi sẽ gửi thông báo qua slack khi hoàn thành.`
      )
      this.file = null
      this.handleClose()
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
.upload {
  margin-top: 4px;
}
.btn-primary {
  background-color: #00b4c3 !important;
  border: 1px solid transparent !important;
}
</style>
