<template>
  <p-modal
    :active="visible"
    :title="title"
    @close="handleClose"
    :disable-close="uploading"
  >
    <template v-if="uploading">
      <div class="text-center processing">
        <p>Quá trình nhập file excel có thể sẽ mất một vài phút ...</p>
        <img src="~@/assets/img/loading.gif" />
      </div>
    </template>
    <template v-else>
      <div align="center">
        <span class="example">
          Tải về file <a :href="templateLink" target="_blank">mẫu XLSX</a>
        </span>
        <upload
          class="order-uploader"
          :action="createEndpoint(`packages/import`)"
          drag
          :auto-upload="false"
          :headers="uploadHeaders"
          :on-change="handleChangeFile"
          :on-max-size="errorSizeFileHandler"
          :max-file-size="2048000"
        >
          <img class="el-icon-upload" src="~@/assets/img/upload.png" alt="" />
          <div class="el-upload__text">
            Kéo thả file để upload hoặc <em>tải lên</em>
          </div>
          <div v-if="!lastItem" class="el-before-upload__text">
            Chưa có file nào được chọn .
          </div>
          <div v-else class="el-before-upload__text">
            {{ lastItem.name }}
          </div>
        </upload>
      </div>
    </template>

    <template slot="footer">
      <div class="rule">
        <p-svg name="InfoCircle"> </p-svg>
        <i
          ><b>Lưu ý:</b>Định dạng file hợp lệ là XLSX và có dung lượng dưới
          2Mb.</i
        >
      </div>
      <div class="group-button">
        <p-button
          type="default"
          @click="handleClose"
          :disabled="loading || uploading"
        >
          Bỏ qua
        </p-button>
        <p-button
          type="primary"
          @click.prevent="handleSave"
          :disabled="!lastItem || uploading"
          :loading="loading || isLoading"
        >
          Tải lên
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinUpload from '@core/mixins/upload'
import { Upload } from '@kit/index'
export default {
  name: 'ModalImport',
  mixins: [mixinRoute, mixinTable, mixinUpload],
  components: { Upload },
  props: {
    title: {
      type: String,
      default: 'Import Trackings',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    uploading: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isFba: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      uploadedIds: [],
      lastItem: null,
      filteredArr: [],
      importData: {
        file: null,
        shop_id: null,
      },
      isLoading: false,
      importDataErrors: {},
      isVisiblePreview: false,
      isUploading: false,
      isVisibleImport: false,
    }
  },
  computed: {
    validFiles() {
      return this.files[this.files.length - 1]
    },
    templateLink() {
      return `${process.env.VUE_APP_ASSETS}/lionbay_template_tracking.xlsx`
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {},
    handleClose() {
      if (this.isLoading === true || this.uploading) {
        return
      }
      this.$emit('update:visible', false)
      this.$emit('reset', true)
    },
    errorSizeFileHandler() {
      this.$toast.open({
        type: 'error',
        message: 'File upload vượt quá dung lượng cho phép',
      })
    },
    customLabel({ name }) {
      return name
    },
    handleSave() {
      if (this.loading || this.isLoading) {
        return
      }
      this.$emit('selected', this.lastItem)
    },
    handlePreview() {
      this.$emit('preview')
    },

    handleChangeFile(file) {
      this.$emit('change', true)
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index === -1) {
        this.files.push(file)
        this.lastItem = this.files[this.files.length - 1]
      } else {
        this.$set(this.files, index, file)
      }
    },
  },
  watch: {
    file: {
      handler: function (val) {
        this.file = val
      },
      immediate: true,
    },
    visible: {
      handler: function (val) {
        this.isVisible = val
      },
      immediate: true,
    },
  },
}
</script>
<style scoped>
.rule {
  font-size: 12px;
  width: 50%;
}
.select_template {
  margin-bottom: 8px;
  line-height: 160%;
}
.select_template label {
  padding-left: 0;
  vertical-align: bottom;
  margin-bottom: 2px;
}
.select_template #templates {
  display: inline-block;
  width: calc(100% - 90px);
  margin-left: 16px;
}
</style>
