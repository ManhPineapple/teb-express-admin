<template>
  <p-modal :active="visible" title="Cập nhật kiện hàng" @close="handleClose">
    <template>
      <div class="row">
        <div class="col-12">
          <label for=""><b>Mã tracking:</b></label>
          <p-input
            type="text"
            v-model="ups_tracking"
            placeholder="Nhập tay hoặc quét barcode"
          >
          </p-input>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-update">
        <p-button type="default" @click="handleClose"> Hủy </p-button>
        <p-button type="info" :loading="loading" @click="handleUpdate">
          Cập nhật
        </p-button>
      </div>
    </template>
  </p-modal>
</template>
<script>
export default {
  name: 'ModalUpdateContainer',
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
      ups_tracking: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleUpdate() {
      this.$emit('update', this.ups_tracking)
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
