<template>
  <div class="modal-set-kpi">
    <p-modal
      :size="`md`"
      :active="visible"
      :title="`Set KPI`"
      @close="handleClose"
    >
      <div class="mb-16">
        <label for=""> KPI doanh thu: </label>
        <p-input
          type="text"
          v-model="revenue_month"
          @input="validateRevenueMonth"
        />
      </div>
      <div>
        <label for=""> KPI khách hàng: </label>
        <div class="row">
          <div class="col-6" style="padding-right: 4px">
            <p-input type="number" v-model="new_user_month" />
            <span class="character">KH</span>
          </div>
          <div class="col-6" style="padding-left: 4px">
            <p-input
              type="text"
              v-model="revenue_per_user"
              @input="validateRevenuePerUser"
            />
            <span class="character">$</span>
          </div>
        </div>
      </div>
      <template slot="footer">
        <div class="group-button modal-confirm">
          <p-button type="default" @click="handleClose"> Bỏ qua</p-button>
          <p-button type="info" :loading="loading" @click="handleSave">
            Xác nhận
          </p-button>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalSetKpi',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    kpi: {
      type: Object,
      default: () => null,
    },
  },
  computed: {},
  data() {
    return {
      revenue_month: '',
      new_user_month: '',
      revenue_per_user: '',
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateRevenueMonth() {
      this.revenue_month = this.revenue_month
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\d\.]+/g, '')
        .replace(/(\..*)\./g, '$1')
      let decimal = this.revenue_month.split('.')[1]
      let number = this.revenue_month.split('.')[0]
      if (decimal !== undefined && decimal.length >= 2) {
        this.revenue_month = `${number}.${decimal.toString().slice(0, 2)}`
      }
    },
    validateRevenuePerUser() {
      this.revenue_per_user = this.revenue_per_user
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\d\.]+/g, '')
        .replace(/(\..*)\./g, '$1')
      let decimal = this.revenue_per_user.split('.')[1]
      let number = this.revenue_per_user.split('.')[0]
      if (decimal !== undefined && decimal.length >= 2) {
        this.revenue_per_user = `${number}.${decimal.toString().slice(0, 2)}`
      }
    },
    async handleSave() {
      const payload = {
        revenue_month: parseFloat(this.revenue_month),
        new_user_month: parseFloat(this.new_user_month),
        revenue_per_user: parseInt(this.revenue_per_user),
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible() {
      if (this.kpi) {
        this.revenue_month = this.kpi.revenue_month
        this.new_user_month = this.kpi.new_user_month
        this.revenue_per_user = this.kpi.revenue_per_user
      }
    },
  },
}
</script>
<style lang="scss">
.modal-set-kpi {
  label {
    margin-bottom: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.32px;
    color: #525252;
  }

  .modal-footer {
    justify-content: flex-end;
  }
  .p-animation-content {
    max-width: 440px;
  }
  .character {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: #a8a8a8;
    position: absolute;
    right: 16px;
    top: 10px;
    display: block;
    width: 20px;
    z-index: 99;
    background: #fff;
  }
}
</style>
