<template>
  <p-modal :active="visible" title="Sửa link TikTok label" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <label>
          <b>Link label</b>&ensp;<span style="color: red">*</span>
        </label>
        <p-input
          type="text"
          v-model.trim="labelLink"
          @input="validateLink"
        ></p-input>
        <div class="invalid-error" v-if="txtError">
          {{ txtError }}
        </div>
      </div>
    </div>

    <template #footer>
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">Bỏ qua</p-button>
        <p-button type="info" @click="handleSave" :loading="loading"
          >Lưu</p-button
        >
      </div>
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalEditTiktokLabel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    initialLink: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      labelLink: '',
      txtError: '',
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.labelLink = this.initialLink || ''
        this.txtError = ''
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateLink() {
      this.txtError = ''
      const value = this.labelLink.trim()
      if (!value) {
        this.txtError = 'Chưa nhập link label!'
        return false
      }
      if (!/^https:\/\/.+/.test(value)) {
        this.txtError = 'Link phải bắt đầu bằng https://'
        return false
      }
      return true
    },
    handleSave() {
      if (!this.validateLink()) return
      this.$emit('save', this.labelLink.trim())
    },
  },
}
</script>

<style scoped>
.p-modal-content label {
  margin-bottom: 0.4rem;
}
.invalid-error {
  color: red;
  margin-top: 4px;
}
</style>
