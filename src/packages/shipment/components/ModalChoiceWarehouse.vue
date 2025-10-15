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
        :disabled="fbaType > 0"
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
      <label for=""><b>Chọn dịch vụ FBA:</b></label>
      <p-select class="" placeholder="Please select" v-model="fbaType">
        <option :value="type.key" v-for="type in fbaOptions" :key="type.key">
          {{ type.text }}
        </option>
      </p-select>
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
import {
  FBA_TYPE_FAST_FBA,
  FBA_TYPE_NOT_FBA,
  FBA_TYPE_STANDARD_FBA,
} from '../constants'

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
      fbaType: FBA_TYPE_NOT_FBA,
      fbaOptions: [
        { text: 'Not FBA', key: FBA_TYPE_NOT_FBA },
        { text: 'Standard FBA', key: FBA_TYPE_STANDARD_FBA },
        { text: 'Fast FBA', key: FBA_TYPE_FAST_FBA },
      ],
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        warehouse_id: this.warehouseID,
        fba_type: this.fbaType,
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible(value) {
      this.isShow = value
      this.warehouseID = 0
      this.fbaType = FBA_TYPE_NOT_FBA
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
