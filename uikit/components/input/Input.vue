<template>
  <div :class="wrapperClasses">
    <template v-if="!['textarea', 'password', 'search'].includes(type)">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <i
        class="form-control-icon form-control-icon-left"
        v-if="prefixIcon"
        :class="`wb-${prefixIcon}`"
      >
      </i>
      <i
        class="form-control-icon form-control-icon-right"
        v-if="suffixIcon"
        :class="`wb-${suffixIcon}`"
      ></i>
      <i
        class="form-control-icon form-control-icon-right"
        v-else-if="isShowClear"
        @click="clear"
      >
        <p-svg name="x-sm"> </p-svg>
      </i>
      <input
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        v-on="listeners"
        :type="type"
        ref="input"
      />
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <template v-if="type == 'password'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>

      <a
        href="#"
        @click.prevent="togglePasswordVisibelity()"
        v-if="hiddenPass == 'on'"
      >
        <p-svg
          class="form-control-icon-eye form-control-icon-right"
          :name="`${typeInputPassword == 'password' ? 'eye' : 'eye-close'}`"
        ></p-svg>
      </a>

      <input
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        v-on="listeners"
        :type="typeInputPassword"
        ref="input"
      />
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <template v-if="type == 'textarea'">
      <textarea
        :class="formControlClasses"
        v-bind="$attrs"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        ref="input"
      >
      </textarea>
    </template>

    <template v-if="type == 'search'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>

      <p-svg
        name="search"
        class="form-control-icon form-control-icon-left"
        v-if="prefixIcon"
      ></p-svg>

      <i
        class="form-control-icon form-control-icon-right"
        v-if="suffixIcon"
        style="cursor: pointer"
        @click="suffixFunc"
      >
        <p-svg name="search"></p-svg>
      </i>

      <i
        class="form-control-icon form-control-icon-right"
        v-else-if="isShowClear"
        @click="clear"
      >
        <p-svg name="x-sm"> </p-svg>
      </i>

      <input
        class="p-input-search"
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        v-on="listeners"
        ref="input"
      />

      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
      <slot />
    </template>

    <span class="invalid-error" v-if="hasError">{{ error }}</span>
  </div>
</template>
<script>
import FormElementMixin from '../../mixins/FormElement'
import PSvg from '../svg/svg'
export default {
  name: 'PInput',
  components: { PSvg },
  inheritAttrs: false,
  mixins: [FormElementMixin],
  props: {
    input: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
    },
    size: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'lg', 'sm'].indexOf(value) > -1
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    suffixFunc: {
      type: Function,
      default: () => {},
    },
    prefixIcon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hiddenPass: {
      type: String,
      default: 'off',
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: String,
  },
  data() {
    return {
      focused: false,
      focusUsername: false,
      typeInputPassword: 'password',
    }
  },
  computed: {
    wrapperClasses() {
      return [
        'p-input-group',
        'input-group',
        this.size ? `input-group-${this.size}` : '',
        {
          'form-icons':
            this.prefixIcon ||
            this.suffixIcon ||
            this.isShowClear ||
            this.hiddenPass,
        },
        this.type === 'file' ? 'input-group-file' : '',
      ]
    },

    formControlClasses() {
      return [
        'p-input',
        'form-control',
        {
          focus: this.focused,
          rounded: this.rounded,
          'input-invalid': this.hasError,
        },
      ]
    },

    isShowClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.nativeInputValue
      )
    },

    nativeInputValue() {
      return this.value === null || typeof this.value === undefined
        ? ''
        : this.value
    },

    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        focus: this.onFocus,
        keypress: this.keypress,
      }
    },

    hasError() {
      return this.error !== undefined && this.error !== ''
    },
  },
  methods: {
    focus() {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    blur() {
      this.$refs.input.blur()
    },

    handleFocus(e) {
      this.focused = true
      this.$emit('focus', e)
    },

    handleBlur(e) {
      this.focused = false
      this.$emit('blur', e)
    },

    onInput(event) {
      if (event.target.value !== this.value) {
        this.$emit('input', event.target.value)
      }
    },
    keypress(evt) {
      if (this.type !== 'number') return true
      evt = evt ? evt : window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46 &&
        charCode !== 45
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    handleChange(e) {
      this.$emit('input', e.target.value)
    },

    togglePasswordVisibelity() {
      this.typeInputPassword =
        this.typeInputPassword == 'password' ? 'text' : 'password'
    },

    clear() {
      this.$emit('input', '')
      this.$emit('update:value', '')
      this.$emit('clear')
    },
  },
}
</script>
