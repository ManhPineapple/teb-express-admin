import config from '../config'
import Emitter from './Emitter'

export default {
  mixins: [Emitter],
  props: {
    size: String,
    expanded: true,
    loading: Boolean,
    autocomplete: String,
    rounded: Boolean,
    maxlength: [Number, String],
    minlength: [Number, String],
    validateEvent: {
      type: Boolean,
      default: true,
    },
    useHtml5Validation: {
      type: Boolean,
      default: config.useHtml5Validation,
    },
  },
  computed: {
    parentField() {
      let parent = this.$parent

      for (let i = 0; i < 3; i++) {
        if (parent && !parent.$data._isField) {
          parent = parent.$parent
        }
      }

      return parent
    },

    statusType() {
      if (!this.parentField) {
        return
      }
      if (!this.parentField.newType) {
        return
      }

      if (typeof this.parentField.newType === 'string') {
        return this.parentField.newType
      } else {
        for (let key in this.parentField.newType) {
          if (this.parentField.newType[key]) {
            return key
          }
        }
      }
    },

    statusMessage() {
      if (!this.parentField) {
        return
      }

      return this.parentField.newMessage
    },
  },
  data() {
    return {
      isValid: true,
      isFocused: false,
    }
  },
  methods: {
    focus() {
      if (this.$data.elementRef === undefined) {
        return
      }

      this.$nextTick(() =>
        this.$el.querySelector(this.$data.elementRef).focus()
      )
    },

    onBlur($event) {
      this.isFocused = false
      this.$emit('blur', $event)
      this.checkHtml5Validity()
      if (this.validateEvent) {
        this.dispatch('SFormItem', 's.form.blur', [this.value])
      }
    },

    onFocus($event) {
      this.isFocused = true
      this.$emit('focus', $event)
    },

    checkHtml5Validity() {
      if (!this.useHtml5Validation) {
        return
      }

      if (this.$refs[this.$data.elementRef] === undefined) {
        return
      }

      const el = this.$el.querySelector(this.$data.elementRef)

      let type = null
      let message = null
      let isValid = true

      if (!el.checkValidity()) {
        type = 'danger'
        message = el.validationMessage
        isValid = false
      }

      this.isValid = isValid
      this.$nextTick(() => {
        if (this.parentField) {
          if (!this.parentField.type) {
            this.parentField.newType = type
          }

          if (!this.parentField.message) {
            this.parentField.newMessage = message
          }
        }
      })

      return this.isValid
    },
  },
}
