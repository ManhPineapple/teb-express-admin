<template>
  <transition :name="animation">
    <div class="modal-confirm">
      <div v-if="isActive" class="p-modal is-active">
        <div class="p-modal-background" @click="cancel('outside')"></div>
        <div class="p-modal-card p-animation-content">
          <div class="modal-content">
            <header class="modal-header" v-if="title">
              <h4 class="modal-title">{{ title }}</h4>
              <button
                type="button"
                class="close"
                aria-label="Close"
                @click="closeModal"
              >
                <span aria-hidden="true" :disabled="disableClose">
                  <p-svg name="x"></p-svg>
                </span>
              </button>
            </header>
            <section class="modal-body">
              <span v-html="message"></span>
              <span
                v-if="link != ''"
                v-html="link"
                style="padding-left: 0.5rem"
              ></span>
            </section>
            <div class="modal-footer">
              <div class="group-button modal-confirm">
                <button
                  v-if="showCancel"
                  class="btn btn-default"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PModal from '../modal/Modal'
import config from '../../config'
import { removeElement } from '../../utils/dom'

export default {
  name: 'BDialog',
  extends: PModal,
  props: {
    title: String,
    message: String,
    icon: String,
    iconPack: String,
    hasIcon: Boolean,
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
    link: String,
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
    closeModal() {
      this.isActive = false
      setTimeout(() => {
        this.$destroy()
        removeElement(this.$el)
      }, 150)
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
