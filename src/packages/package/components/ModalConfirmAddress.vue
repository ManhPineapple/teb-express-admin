<template>
  <p-modal
    id="confirm-address"
    :active="visible"
    title="Check Address"
    @close="handleClose"
  >
    <div class="text-center confirm-container">
      <div class="address-box">
        <strong>Order:</strong>
        <span class="address">{{ pkg.order_number }}</span>
        <strong>Address:</strong>
        <span class="address">{{ pkg.address_1 }}</span>
      </div>
      <p>Are you sure this is a valid address? Please kindly confirm!</p>
    </div>
    <template #footer>
      <p-button class="p-button-outlined" @click="handleClose">Close</p-button>
      <p-button class="p-button-success" @click="confirmAddress"
        >Confirm</p-button
      >
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalConfirmAddress',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    pkg: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    confirmAddress() {
      this.$emit('confirm')
      this.handleClose()
    },
  },
}
</script>

<style scoped>
.confirm-container {
  text-align: center;
}

.address-box {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address {
  font-weight: bold;
}

.p-button-outlined {
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
}

.p-button-success {
  background-color: #009688;
  color: #fff;
}

.p-button {
  margin: 0 5px;
}
</style>
