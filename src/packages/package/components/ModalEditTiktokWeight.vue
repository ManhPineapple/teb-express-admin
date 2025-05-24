<template>
  <p-modal :active="visible" title="Sửa cân nặng TikTok" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <label for="">
          <b>Khối lượng</b> (g)&ensp;<span style="color: red">*</span>
        </label>
        <p-input
          type="text"
          v-model="weight"
          @input="validateWeight"
          @change="formatWeight"
        ></p-input>
        <div class="invalid-error" v-if="txtError">
          {{ txtError }}
        </div>
      </div>
    </div>
    <template #footer>
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleSave" :loading="loading">
          Lưu
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalEditTiktokWeight',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    initialWeight: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      weight: '',
      txtError: '',
    }
  },
  watch: {
    visible: {
      handler() {
        this.weight = this.initialWeight ? this.initialWeight.toString() : ''
        this.txtError = ''
      },
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateWeight() {
      this.weight = this.weight.replace(/\s+/g, '').replaceAll(',', '')
      if (!/^\d+$/.test(this.weight)) {
        this.txtError = 'Khối lượng phải là số nguyên dương!'
        return
      }
      this.txtError = ''
    },
    formatWeight() {
      this.weight = this.weight.replace(/\s+/g, '').replaceAll(',', '')
      if (!/^\d+$/.test(this.weight)) return

      this.weight = this.weight.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    validateParams() {
      this.txtError = ''
      const raw = this.weight.replace(/\s+/g, '').replaceAll(',', '')
      if (raw === '') {
        this.txtError = 'Chưa nhập khối lượng!'
        return false
      }
      if (!/^\d+$/.test(raw)) {
        this.txtError = 'Khối lượng phải là số nguyên dương!'
        return false
      }
      return true
    },
    handleSave() {
      if (!this.validateParams()) return
      const payload = parseInt(
        this.weight.replace(/\s+/g, '').replaceAll(',', ''),
        10
      )
      this.$emit('save', payload)
    },
  },
}
</script>

<style scoped>
.p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
