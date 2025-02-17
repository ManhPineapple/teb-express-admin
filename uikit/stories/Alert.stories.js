import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PAlert from '../components/alert/Alert.vue'
storiesOf('Alert', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PAlert },
    template: `
      <div style="width: 50vw;">
        <p-alert
          class="mb-10"
          title="success alert"
          type="success"
          show-icon>
        </p-alert>
        <p-alert
          class="mb-10"
          title="info alert"
          type="info"
          show-icon>
        </p-alert>
        <p-alert
          class="mb-10"
          title="warning alert"
          type="warning"
          show-icon>
        </p-alert>
        <p-alert
          class="mb-10"
          title="error alert"
          type="error"
          show-icon>
        </p-alert>
      </div>
    `,
  }))
