<template>
  <div
    :class="wrapperClasses"
    ref="checkbox"
    @keydown.prevent.enter="$refs.checkbox.click()"
  >
    <input
      v-model="internalVal"
      :indeterminate.prop="indeterminate"
      type="checkbox"
      :id="elementID"
      @click.stop
      :disabled="disabled"
      :required="required"
      :name="name"
      :value="nativeValue"
      :true-value="trueValue"
      :false-value="falseValue"
    />
    <label :for="elementID" @click="toggle">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  name: 'PCheckbox',
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
      default: 'primary',
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
      validator(value) {
        return ['', 'lg', 'sm'].indexOf(value) > -1
      },
    },
    trueValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean, Function, Object, Array, Symbol],
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    elementID() {
      return 'cb' + Math.round(Math.random() * 1e6)
    },
    wrapperClasses() {
      return [
        'p-checkbox',
        'checkbox-custom',
        this.type ? `checkbox-${this.type}` : 'checkbox-default',
        this.size ? `checkbox-${this.size}` : '',
        {
          'checkbox-circle': this.circle,
          'checkbox-inline': this.inline,
        },
      ]
    },
  },
  data() {
    return {
      internalVal: this.value,
    }
  },
  methods: {
    handleArrayCheckbox() {
      return
    },
    toggle() {
      // this.internalVal = !this.internalVal
    },
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
