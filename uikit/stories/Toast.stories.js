import { storiesOf } from '@storybook/vue'
import Vue from 'vue'
import Centered from '@storybook/addon-centered'
import Plugin from '../components/toast/plugin.js'
import PButton from '../components/button/Button.vue'
Plugin.install(Vue)

storiesOf('Toast', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: {
      PButton,
    },
    template: `
    <section>
      <p-button type="default" @click="toast">
        Launch toast (default)
      </p-button>
      <p-button type="primary" @click="success">
        Launch toast (custom)
      </p-button>
      <p-button type="danger" @click="danger">
        Launch toast (custom)
      </p-button>
    </section>`,
    methods: {
      toast() {
        this.$toast.open('Something happened')
      },
      success() {
        this.$toast.open({
          message: 'Something happened correctly!',
          type: 'success',
        })
      },
      danger() {
        this.$toast.open({
          duration: 5000,
          message: `Something's not good, also I'm on bottom`,
          position: 'bottom',
          type: 'danger',
        })
      },
    },
  }))
