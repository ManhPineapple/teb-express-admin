<template>
  <select
    :class="classes"
    v-model="internalVal"
    ref="select"
    :multiple="multiple"
    :size="nativeSize"
    v-bind="$attrs"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    @change="$emit('reset', true)"
  >
    <template v-if="placeholder">
      <option v-if="internalVal == null" :value="null" disabled hidden>
        {{ placeholder }}
      </option>
    </template>
    <slot />
  </select>
</template>

<script>
import FormElementMixin from '../../mixins/FormElement'
export default {
  name: 'PSelect',
  inheritAttrs: false,
  mixins: [FormElementMixin],
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Symbol, Function],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
    nativeSize: {
      type: [String, Number],
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalVal: this.value,
    }
  },
  computed: {
    classes() {
      return [
        this.size ? `form-control-${this.size}` : '',
        {
          'p-select': true,
          'form-control': true,
        },
      ]
    },
  },
  watch: {
    internalVal(val) {
      this.$emit('input', val)
    },

    /**
     * When v-model is changed:
     *   1. Set the internalVal option.
     *   2. If it's invalid, validate again.
     */
    value(value) {
      this.internalVal = value
    },
  },
}
</script>
