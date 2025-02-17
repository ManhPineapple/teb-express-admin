<template>
  <label
    :class="wrapperClasses"
    ref="label"
    :disabled="disabled"
    @keydown.prevent.enter="$refs.label.click()"
    @mousedown="isMouseDown = true"
    @mouseup="isMouseDown = false"
    @mouseout="isMouseDown = false"
    @blur="isMouseDown = false"
  >
    <input
      v-model="internalVal"
      type="checkbox"
      @click.stop
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="nativeValue"
      :true-value="trueValue"
      :false-value="falseValue"
    />
    <span
      class="check"
      :class="[{ 'is-elastic': isMouseDown && !disabled }, type]"
    >
    </span>
    <span class="control-label">
      <slot />
    </span>
  </label>
</template>

<script>
export default {
  name: 'PSwitch',
  props: {
    value: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
    },
    nativeValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    trueValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
      default: false,
    },
  },
  computed: {
    wrapperClasses() {
      return [
        'p-switch',
        this.size ? `p-switch--${this.size}` : '',
        { 'is-disabled': this.disabled },
        { 'is-rounded': this.rounded },
        { 'is-outlined': this.outlined },
      ]
    },
  },
  data() {
    return {
      internalVal: this.value,
      isMouseDown: false,
    }
  },
  watch: {
    internalVal(val) {
      this.$emit('input', val)
    },

    /**
     * When v-model change, set internal value.
     */
    value(value) {
      this.internalVal = value
    },
  },
}
</script>
