<template>
  <div class="modal-edit-rate">
    <p-modal
      :size="`sm`"
      :active="isShow"
      :title="`Sửa tỷ giá`"
      @close="handleClose"
    >
      <div>
        <label for=""><b>Tỷ giá:</b></label>
        <p-input
          type="number"
          min="0"
          :value="rate"
          v-model.number="price"
          :error="err"
        />
      </div>
      <template slot="footer">
        <div class="group-button modal-confirm">
          <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
          <p-button
            type="info"
            :disabled="isDisableSave"
            :loading="loading"
            @click="handleSave"
          >
            Sửa
          </p-button>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalEditExchange',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
    },
  },
  computed: {
    isDisableSave() {
      return this.rate == this.price
    },
  },
  data() {
    return {
      price: this.rate,
      isShow: this.visible,
      err: '',
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      // eslint-disable-next-line no-useless-escape
      if (!/^\d+$/gm.test(this.price)) {
        this.err = 'Giá trị nhập vào không hợp lệ'
        return
      }
      if (this.price < 0.1) {
        this.err = 'Giá trị nhập vào không hợp lệ'
        return
      }
      const payload = {
        price: this.price,
      }
      this.err = ''
      this.$emit('save', payload)
    },
  },
  watch: {
    visible(value) {
      this.isShow = value
      this.err = ''
      this.price = this.rate
    },
    rate(value) {
      this.price = value
    },
  },
}
</script>
<style lang="scss">
.modal-edit-rate {
  label {
    margin-bottom: 5px;
  }

  .modal-footer {
    justify-content: flex-end;
  }
}
</style>
