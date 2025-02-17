import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PModal from '../components/modal/Modal'
import PButton from '../components/button/Button'
storiesOf('Modal', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PModal, PButton },
    data() {
      return {
        isImageModalActive: false,
        isCardModalActive: false,
      }
    },
    template: `
      <section>
        <p-button type="primary" @click="isImageModalActive = true">
          Launch modal
        </p-button>
        <p-modal :active.sync="isImageModalActive" title="Modal title">
          <p>One fine body…</p>
          <template slot="footer">
            <p-button type="default" @click="isImageModalActive = false">
              <span>Cancel</span>
            </p-button>
            <p-button type="primary" click="isImageModalActive = false">
              <span>Confirm</span>
            </p-button>
          </template>
        </p-modal>
      </section>
    `,
  }))
