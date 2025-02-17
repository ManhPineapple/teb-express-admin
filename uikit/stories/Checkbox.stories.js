import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PCheckbox from '../components/checkbox/Checkbox'

storiesOf('Checkbox', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PCheckbox },
    data() {
      return {
        checkbox: false,
        checkboxCustom: 'Yes',
      }
    },
    template: `
      <div>
        <p-checkbox>Basic</p-checkbox>
        <p-checkbox v-model="checkbox">{{ checkbox }}</p-checkbox>
        <p-checkbox v-model="checkboxCustom" true-value="Yes" false-value="No">
          {{ checkboxCustom }}
        </p-checkbox>
        <p-checkbox :indeterminate="true">indeterminate</p-checkbox>
        <p-checkbox :disabled="true">Disabled</p-checkbox>
      </div>
    `,
  }))
  .add('Group', () => ({
    components: { PCheckbox },
    data() {
      return {
        checkbox: ['kwan'],
      }
    },
    template: `
      <div>
        <p-checkbox v-model="checkbox" native-value="Erik">Erik</p-checkbox>
        <p-checkbox v-model="checkbox" native-value="Jambon">Jambon</p-checkbox>
        <p-checkbox v-model="checkbox" native-value="Kwan">Kwan</p-checkbox>
        <p>
          <strong>Selection:</strong> {{ checkbox }}
        </p>
      </div>
    `,
  }))
  .add('Size', () => ({
    components: { PCheckbox },
    template: `
      <div>
        <p-checkbox size="lg">Large</p-checkbox>
        <p-checkbox>Medium</p-checkbox>
        <p-checkbox>Default</p-checkbox>
        <p-checkbox size="sm">Small</p-checkbox>
      </div>
    `,
  }))
  .add('Type', () => ({
    components: { PCheckbox },
    template: `
      <div>
        <p-checkbox>Default</p-checkbox>
        <p-checkbox type="primary">Primary</p-checkbox>
        <p-checkbox type="success">Success</p-checkbox>
        <p-checkbox type="info">Info</p-checkbox>
        <p-checkbox type="danger">Danger</p-checkbox>
        <p-checkbox type="warning">Warning</p-checkbox>
      </div>
    `,
  }))
