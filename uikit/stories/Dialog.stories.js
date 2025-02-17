import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import Plugin from '../components/dialog/plugin.js'
import PButton from '../components/button/Button'

Plugin.install(Vue)

storiesOf('Dialog', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PButton },
    template: `
    <section>
      <p-button type="primary" @click="alert">
        Launch alert (default)
      </p-button>
      <p-button type="primary" @click="alertCustom">
        Launch alert (custom)
      </p-button>
      <p-button type="danger" @click="alertCustomError">
        Launch alert (custom)
      </p-button>
    </section>`,
    methods: {
      alert() {
        this.$dialog.alert('Everything looks fine!')
      },
      alertCustom() {
        this.$dialog.alert({
          title: 'Title Alert',
          message: 'I have a title, a custom button and <b>HTML</b>!',
          confirmText: 'Cool!',
          canCancel: true,
        })
      },
      alertCustomError() {
        this.$dialog.alert({
          title: 'Error',
          message:
            "Something's not good but I have a custom <b>icon</b> and <b>type</b>",
          type: 'danger',
          hasIcon: true,
        })
      },
    },
  }))
