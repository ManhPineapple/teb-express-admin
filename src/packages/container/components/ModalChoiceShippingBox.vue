<template>
  <p-modal :active.sync="isShow" :title="title" @close="handleClose">
    <div v-if="isCreate">
      <div class="row">
        <div class="col">
          <label for="" v-if="!isFBA"><b>Kho:</b></label>
          <p-select
            class="floating"
            v-model="warehouseID"
            name="warehouseID"
            v-if="!isFBA"
          >
            <option value="0">Chọn kho</option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :value="warehouse.id"
              >HUB {{ warehouse.state }}
            </option>
          </p-select>
          <div v-if="warehouseID == 0" style="height: 23px; margin: 11px 0">
            <p-checkbox v-model="isFBA" class="fb-cb">IS FBA</p-checkbox>
          </div>
        </div>
        <div class="col">
          <label for=""><b>Chọn kiểu label:</b></label>
          <p-select
            class=""
            placeholder="Please select"
            v-model="containerType"
          >
            <option :value="type.key" v-for="type in types" :key="type.key">
              {{ type.text }}
            </option>
          </p-select>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-6">
          <label for=""><b>Loại:</b></label>
          <p-select class="floating" v-model="type" name="type">
            <option value="0">Chọn một loại</option>
            <option v-for="box in boxes" :key="box.id" :value="box.id"
              >Loại {{ `${box.length}x${box.width}x${box.height}` }}</option
            >
            <option :value="maxIDBox + 1">Khác</option>
          </p-select>
        </div>
        <div class="col-6" v-if="type < maxIDBox + 1">
          <label for=""><b>Cân nặng tối đa:</b> (kg)</label>
          <p-select
            :disabled="true"
            class="floating"
            v-model="type"
            name="weight"
          >
            <option value="0">Chọn cân nặng tối đa</option>
            <option v-for="box in boxes" :key="box.id" :value="box.id">{{
              box.max_weight
            }}</option>
          </p-select>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-6">
          <label for=""><b>Cân nặng:</b> (kg)</label>
          <p-input
            type="number"
            min="0"
            name="weight"
            v-model.number="weight"
            :error="valider.error('weight')"
          />
        </div>
        <div class="col-6">
          <label for=""><b>Cân nặng thực tế (kg)</b></label>
          <p-input
            type="number"
            min="0"
            name="actual_weight"
            v-model.number="actual_weight"
            :error="valider.error('actual_weight')"
          />
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-4">
          <label for=""><b>Chiều cao:</b> (cm)</label>
          <p-select
            :disabled="true"
            class="floating"
            v-model="type"
            name="high"
            v-if="type < maxIDBox + 1"
          >
            <option value="0">Chọn chiều cao</option>
            <option v-for="box in boxes" :key="box.id" :value="box.id">{{
              box.height
            }}</option>
          </p-select>
          <p-input
            v-else
            type="number"
            min="0"
            name="height"
            v-model.number="box.height"
            :error="valider.error('height')"
          />
        </div>
        <div class="col-4">
          <label for=""><b>Chiều rộng:</b> (cm)</label>
          <p-select
            :disabled="true"
            class="floating"
            v-model="type"
            name="width"
            v-if="type < maxIDBox + 1"
          >
            <option value="0">Chọn chiều rộng</option>
            <option v-for="box in boxes" :key="box.id" :value="box.id">{{
              box.width
            }}</option>
          </p-select>
          <p-input
            v-else
            type="number"
            min="0"
            name="width"
            v-model.number="box.width"
            :error="valider.error('width')"
          />
        </div>
        <div class="col-4">
          <label for=""><b>Chiều dài:</b> (cm)</label>
          <p-select
            :disabled="true"
            class="floating"
            v-model="type"
            name="length"
            v-if="type < maxIDBox + 1"
          >
            <option value="0">Chọn chiều dài</option>
            <option v-for="box in boxes" :key="box.id" :value="box.id">{{
              box.length
            }}</option>
          </p-select>
          <p-input
            v-else
            type="number"
            min="0"
            name="length"
            v-model.number="box.length"
            :error="valider.error('length')"
          />
        </div>
      </div>
      <template v-if="typeContainer === typeManual">
        <br />
        <div class="row">
          <div class="col-12">
            <label for=""><b>Mã tracking</b></label>
            <p-input
              :placeholder="`Nhập tay hoặc quét barcode`"
              v-model="tracking_number"
              :error="err"
            />
          </div>
        </div>
      </template>
    </div>

    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> {{ cancel }} </p-button>
        <p-button
          type="info"
          @click="handleSave"
          :loading="loading"
          :disabled="type < 1 && !isCreate"
        >
          {{ actionConfirm }}
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import valider from '@core/valider'
import {
  CONTAINER_TYPE_API,
  CONTAINER_TYPE_MANUAL,
  CONTAINER_TYPE_FEDEX,
} from '../contants'

export default {
  name: 'ModalChoiceShippingBox',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    boxes: {
      type: Array,
      default: () => [],
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    actionConfirm: {
      type: String,
    },
    cancel: {
      type: String,
      default: 'Hủy',
    },
    title: {
      type: String,
    },
    typeContainer: {
      type: Number,
    },
  },
  created() {
    this.valider = valider.schema((y) => ({
      height: y
        .number()
        .typeError('Chiều cao không hợp lệ')
        .min(0.1, 'Chiều cao không hợp lệ'),
      length: y
        .number()
        .typeError('Chiều dài không hợp lệ')
        .min(0.1, 'Chiều dài không hợp lệ'),
      width: y
        .number()
        .typeError('Chiều rộng không hợp lệ')
        .min(0.1, 'Chiều rộng không hợp lệ'),
      weight: y
        .number()
        .typeError('Cân nặng không hợp lệ')
        .min(0.1, 'Cân nặng không hợp lệ'),
      actual_weight: y
        .number()
        .typeError('Cân nặng thực tế không hợp lệ')
        .min(0.1, 'Cân nặng thực tế không hợp lệ'),
    }))
    this.valider.reset()
  },
  mounted() {
    this.type = this.boxes[0] ? this.boxes[0].id : 0
  },
  computed: {
    maxIDBox() {
      return Math.max.apply(
        Math,
        this.boxes.map(function (x) {
          return x.id
        })
      )
    },
    classInput() {
      return this.type < this.maxIDBox + 1 ? 'col-4' : 'col-6'
    },
  },
  data() {
    return {
      isShow: this.visible,
      box: {
        height: 0,
        length: 0,
        width: 0,
        max_weight: 0,
      },
      isFBA: false,
      actual_weight: 0,
      weight: 0,
      tracking_number: '',
      warehouse: {},
      type: 0,
      warehouseID: 0,
      store: 1,
      valider: null,
      err: '',
      types: [
        {
          key: CONTAINER_TYPE_API,
          text: 'Label Ananbay',
        },
        {
          key: CONTAINER_TYPE_MANUAL,
          text: 'Label Ngoài',
        },
        {
          key: CONTAINER_TYPE_FEDEX,
          text: 'Label FedEx',
        },
      ],
      containerType: CONTAINER_TYPE_FEDEX,
      typeManual: CONTAINER_TYPE_MANUAL,
    }
  },
  methods: {
    handleClose() {
      this.err = ''
      this.tracking_number = ''
      this.weight = 0
      this.valider.reset()
      this.$emit('update:visible', false)
    },
    async handleSave() {
      if (this.type < this.maxIDBox + 1) {
        this.box = { ...this.boxes.find((i) => i.id == this.type) }
        if (this.weight > this.box.max_weight) {
          this.$toast.open({
            message: 'Vượt quá cân nặng tối đa',
            type: 'error',
          })
          return
        }
      }

      this.tracking_number = this.tracking_number.trim().toUpperCase()
      var re = /^[a-zA-Z0-9]*$/g
      if (!re.test(this.tracking_number)) {
        this.err = 'Tracking number không hợp lệ'
        return
      }

      this.box = Object.assign(this.box, {
        weight: this.weight,
        tracking_number: this.tracking_number,
        actual_weight: this.actual_weight,
      })
      if (!this.valider.check(this.box) && !this.isCreate) {
        return
      }

      let payload = {}
      if (this.isCreate) {
        payload = {
          warehouse_id: parseInt(this.warehouseID),
          type: this.containerType,
        }
        payload.is_fba = false
        if (this.isFBA) {
          payload.is_fba = true
        }
      } else {
        payload = {
          width: this.box.width,
          height: this.box.height,
          length: this.box.length,
          weight: this.box.weight,
          actual_weight: this.box.actual_weight,
          tracking_number: this.box.tracking_number,
        }
      }

      this.$emit('save', payload)
    },
    handleUpdateType(value) {
      this.type = value
    },
  },
  watch: {
    visible(value) {
      this.isShow = value
      this.type = 0
      this.warehouseID = 0
      this.isFBA = false
      this.containerType = CONTAINER_TYPE_FEDEX
      this.actual_weight = 0
      this.weight = 0
      this.tracking_number = ''
    },
    type(val) {
      if (val == this.maxIDBox + 1) {
        this.box.height = 0
        this.box.length = 0
        this.box.width = 0
        this.box.max_weight = 0
      }
    },
  },
}
</script>
<style>
@media screen and (min-width: 1088px) {
  .p-modal-content.modal-lg,
  .p-modal-card.modal-lg {
    width: 800px;
  }
}

.p-modal-content label {
  margin-bottom: 0.4rem;
}
.fb-cb {
  top: unset !important;
}
</style>
