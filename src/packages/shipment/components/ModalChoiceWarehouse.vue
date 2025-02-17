<template>
  <p-modal
    :size="`sm`"
    :active.sync="isShow"
    :title="`Tạo lô hàng`"
    @close="handleClose"
  >
    <div>
      <label for=""><b>Kho:</b></label>
      <p-select
        class="floating"
        v-model="warehouseID"
        name="warehouseID"
        :disabled="isFBA"
      >
        <option value="0">Chọn kho</option>
        <option
          v-for="warehouse in warehouses"
          :key="warehouse.id"
          :value="warehouse.id"
          >HUB {{ warehouse.state }}</option
        >
      </p-select>
    </div>

    <div class="mt-24" style="position: relative">
      <p-checkbox v-model="isFBA" style="padding: 11px 0 0">IS FBA</p-checkbox>
    </div>

    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" :loading="loading" @click="handleSave">
          Tạo
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalChoiceWarehouse',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isShow: this.visible,
      warehouse: {},
      warehouseID: 0,
      isFBA: false,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        warehouse_id: this.warehouseID,
        is_fba: this.isFBA,
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible(value) {
      this.isShow = value
      this.warehouseID = 0
      this.isFBA = false
    },
  },
}
</script>
<style scoped>
.group-button {
  width: 100%;
  text-align: right;
}
@media screen and (min-width: 1088px) {
  .p-modal-content.modal-lg,
  .p-modal-card.modal-lg {
    width: 300px;
  }
}
.p-modal-content label {
  margin-bottom: 0.4rem;
}
.checkbox-custom {
  position: relative;
}
</style>
