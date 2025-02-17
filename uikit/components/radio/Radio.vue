<template>
  <div
    :class="wrapperClasses"
    ref="radio"
    @keydown.prevent.enter="$refs.radio.click()"
  >
    <label>
      <input
        v-model="internalVal"
        :indeterminate.prop="indeterminate"
        type="radio"
        @click.stop
        :disabled="disabled"
        :required="required"
        :name="name"
        :value="nativeValue"
        :true-value="trueValue"
        :false-value="falseValue"
      />
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  name: 'PRadio',
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
  },
  computed: {
    wrapperClasses() {
      return [
        'p-radio',
        'radio-custom',
        this.type ? `radio-${this.type}` : 'radio-default',
        this.size ? `radio-${this.size}` : '',
        {
          'radio-inline': this.inline,
        },
      ]
    },
  },
  data() {
    return {
      internalVal: this.value,
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
