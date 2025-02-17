<template>
  <transition :name="animation">
    <div
      v-if="isActive"
      class="p-dialog p-modal is-active"
      :class="{ 'has-top-icon': topIcon }"
    >
      <div class="p-modal-background" @click="cancel('outside')"></div>
      <div class="p-modal-card p-animation-content">
        <div class="modal-content">
          <header class="modal-header" v-if="title">
            <h4 class="modal-title">{{ title }}</h4>
          </header>
          <section class="modal-body" v-if="message">
            <span v-if="topIcon" :class="iconTopWrapClass">
              {{ topIconText }}
            </span>
            <div class="media">
              <div class="mr-4" v-if="hasIcon">
                <p-icon
                  class="font-size-40"
                  :name="icon ? icon : iconByType"
                  :iconPack="iconPack"
                  :type="type"
                />
              </div>
              <div class="media-body">
                <p v-html="message"></p>

                <div v-if="hasInput" class="form-group">
                  <p-input
                    v-model="prompt"
                    ref="input"
                    :class="{ 'is-invalid': validationMessage }"
                    v-bind="inputAttrs"
                    @keyup.enter="confirm"
                  ></p-input>
                  <p class="invalid-feedback">{{ validationMessage }}</p>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-footer justify-content-end">
            <div class="group-button">
              <button
                v-if="showCancel"
                class="btn btn-danger"
                ref="cancelButton"
                @click="cancel('button')"
              >
                {{ cancelText }}
              </button>
              <button
                class="btn ml-2"
                :class="`btn-${type}`"
                ref="confirmButton"
                @click="confirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PInput from '../input/Input'
import PIcon from '../icon/Icon'
import PModal from '../modal/Modal'
import config from '../../config'
import { removeElement } from '../../utils/dom'

export default {
  name: 'BDialog',
  components: {
    PIcon,
    PInput,
  },
  extends: PModal,
  props: {
    title: String,
    message: String,
    icon: String,
    iconPack: String,
    hasIcon: Boolean,
    topIcon: {
      type: Boolean,
      default: false,
    },
    topIconText: {
      type: String,
      default: '',
    },
    iconTopClass: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'primary',
    },
    confirmText: {
      type: String,
      default: () => {
        return config.defaultDialogConfirmText
          ? config.defaultDialogConfirmText
          : 'OK'
      },
    },
    cancelText: {
      type: String,
      default: () => {
        return config.defaultDialogCancelText
          ? config.defaultDialogCancelText
          : 'Cancel'
      },
    },
    hasInput: Boolean, // Used internally to know if it's prompt
    inputAttrs: {
      type: Object,
      default: () => ({}),
    },
    onConfirm: {
      type: Function,
      default: () => {},
    },
    focusOn: {
      type: String,
      default: 'confirm',
    },
  },
  data() {
    const prompt = this.hasInput ? this.inputAttrs.value || '' : ''

    return {
      prompt,
      isActive: false,
      validationMessage: '',
    }
  },
  computed: {
    /**
     * Icon name (WB) based on the type.
     */
    iconByType() {
      switch (this.type) {
        case 'info':
          return 'info-circle'
        case 'success':
          return 'check-circle'
        case 'warning':
          return 'alert'
        case 'danger':
          return 'alert-circle'
        default:
          return null
      }
    },
    iconTopWrapClass() {
      const sClass = this.iconTopClass
      return `badge badge-round badge-${sClass}`
    },
    showCancel() {
      return this.cancelOptions.indexOf('button') >= 0
    },
  },
  methods: {
    /**
     * If it's a prompt Dialog, validate the input.
     * Call the onConfirm prop (function) and close the Dialog.
     */
    confirm() {
      if (this.$refs.input !== undefined) {
        if (!this.$refs.input.checkValidity()) {
          this.validationMessage = this.$refs.input.validationMessage
          this.$nextTick(() => this.$refs.input.select())
          return
        }
      }
      this.close()
      this.onConfirm(this.prompt)
    },

    /**
     * Close the Dialog.
     */
    close() {
      this.isActive = false
      // Timeout for the animation complete before destroying
      setTimeout(() => {
        this.$destroy()
        removeElement(this.$el)
      }, 150)
    },
  },
  beforeMount() {
    // Insert the Dialog component in body tag
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
  },
  mounted() {
    this.isActive = true

    if (typeof this.inputAttrs.required === 'undefined') {
      this.$set(this.inputAttrs, 'required', true)
    }

    this.$nextTick(() => {
      // Handle which element receives focus
      if (this.hasInput) {
        this.$refs.input.focus()
      } else if (this.focusOn === 'cancel' && this.showCancel) {
        this.$refs.cancelButton.focus()
      } else {
        this.$refs.confirmButton.focus()
      }
    })
  },
}
</script>
