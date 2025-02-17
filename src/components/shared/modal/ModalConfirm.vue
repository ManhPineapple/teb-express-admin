<template>
  <div class="modal-confirm">
    <p-modal :size="size" :active="visible" :title="title" @close="handleClose">
      <template>
        <p v-html="description"></p>
        <p v-html="description_1"></p>
        <span
          v-if="link != ''"
          v-html="link"
          style="padding-left: 0.5rem"
        ></span>
      </template>
      <template slot="footer">
        <div class="group-button modal-confirm">
          <p-button type="default" @click="handleClose">
            {{ cancel }}
          </p-button>
          <p-button
            :type="type"
            @click.prevent="handleAction(id)"
            :disabled="disabled"
            :loading="loading"
          >
            {{ actionConfirm }}
          </p-button>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinUpload from '@core/mixins/upload'

export default {
  name: 'ModalConfirm',
  mixins: [mixinRoute, mixinTable, mixinUpload],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'Bạn có chắc chắn không?',
    },
    description_1: {
      type: String,
      default: '',
    },
    actionConfirm: {
      type: String,
    },
    cancel: {
      type: String,
      default: 'Hủy',
    },
    type: {
      type: String,
      default: 'info',
    },
    id: {},
    link: {
      type: String,
      default: '',
    },
    shop: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    errorUrl: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: null,
      shopChoose: '',
      requiredShopname: false,
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('reset', true)
      this.$emit('close', true)
      this.$emit('update:error', '')
      this.$emit('leave')
      this.$emit('update:errorUrl', '')
    },
    handleAction(id) {
      this.$emit('action', id)
      if (this.shop) {
        this.$emit('shopAction', {
          brand: this.selected,
          shopname: this.shopChoose,
        })
      }
    },
    customLabel({ key, name }) {
      return typeof key !== 'undefined' ? `${name}` : ''
    },
    handleSelect(value) {
      this.selected = value
      this.$emit('update:error', '')
    },
    check(e) {
      if (e) {
        this.$emit('update:errorUrl', '')
      }
    },
  },
  watch: {},
}
</script>
<style lang="scss">
.modal-confirm {
  .modal-body {
    overflow-y: unset;
  }
  .title {
    font-weight: 700;
    margin-bottom: 4px;
  }
  .input-shop {
    display: inline-flex;
    width: 100%;
    .multiselect__content-wrapper {
      border: 1px solid;
      border-top: none;
      .multiselect__option:hover {
        background: #4a6ff6;
        span {
          color: white;
          background: #4a6ff6;
        }
      }
    }
    .multiselect__tags {
      height: 50px;
      border: 1px solid;
      background: #fff;
    }
    .multiselect__select {
      height: 50px;
    }
    .multiselect__single,
    .multiselect__placeholder {
      background: #fff;
    }
    &.onerror {
      .multiselect__tags {
        height: 50px;
        border: 1px solid red !important;
        background: #fff;
      }
    }
  }
  .domain {
    width: 148px;
    height: 50px;
    background: #f4f5f6;
    border-radius: 0px 4px 4px 0px;
    line-height: 50px;
    text-align: center;
  }
  .input-shop_name {
    width: 210px;
    .error-link-shop {
      margin-left: 10px;
    }
    &.onerror {
      .p-input {
        border-color: red;
      }
    }
  }
  .p-input {
    //border-radius: 4px 0px 0px 4px !important;
    height: 50px;
    margin: 0 2px 0 8px;
  }
  .multiselect-custom {
    flex: 1;
  }
  .multiselect__option--selected {
    font-weight: bold;
  }
  .error-link-shop {
    margin-top: 5px;
    color: red;
  }
}
</style>
