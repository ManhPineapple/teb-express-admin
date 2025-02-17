import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PRadio from '../components/radio/Radio'

storiesOf('Radio', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PRadio },
    template: `
      <div>
        <p-radio v-model="radio" native-value="erik">Erik</p-radio>
        <p-radio v-model="radio" native-value="jambon">Jambon</p-radio>
        <p-radio v-model="radio" native-value="kwan">Kwan</p-radio>
        <p>
            <strong>Selection:</strong> {{ radio }}
          </p>
      </div>
    `,
    data() {
      return {
        radio: 'kwan',
      }
    },
  }))
  .add('Disable', () => ({
    components: { PRadio },
    template: `
      <div>
        <p-radio :disabled="true" native-value="erik">Erik</p-radio>
        <p-radio :disabled="true" native-value="jambon">Jambon</p-radio>
      </div>
    `,
  }))
  .add('Type', () => ({
    components: { PRadio },
    template: `
      <div>
        <p-radio>Default</p-radio>
        <p-radio type="primary">Primary</p-radio>
        <p-radio type="success">Success</p-radio>
        <p-radio type="info">Info</p-radio>
        <p-radio type="danger">Danger</p-radio>
        <p-radio type="warning">Warning</p-radio>
      </div>
    `,
  }))
