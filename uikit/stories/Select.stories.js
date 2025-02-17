import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Centered from '@storybook/addon-centered'
import PSelect from '../components/select/Select'

storiesOf('Select', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: {
      PSelect,
    },
    data() {
      return {
        select: 2,
        items: [
          {
            value: 1,
            text: 'Select one',
          },
          {
            value: 2,
            text: 'Select two',
          },
        ],
      }
    },
    methods: {
      onChange: action('change'),
      onBlur: action('blur'),
      onFocus: action('focus'),
    },
    template: `
      <div>
        <div>
          <label>Default</label>
          <p-select placeholder="Please select" @change="onChange" @blur="onBlur" @focus="onFocus">
            <option :value="item.value" v-for="(item, index) in items" :key="index">
              {{ item.text }}
            </option>
          </p-select>
          <p>
            <strong>Selection:</strong> {{ select }}
          </p>
        </div>

        <div class="m-t">
          <label>Disabled select</label>
          <p-select disabled>
            <option :value="item.value" v-for="(item, index) in items" :key="index">
              {{ item.text }}
            </option>
          </p-select>
        </div>
      </div>
    `,
  }))
  .add('Size', () => ({
    components: {
      PSelect,
    },
    data() {
      return {
        items: [
          {
            value: 1,
            text: 'Select one',
          },
          {
            value: 2,
            text: 'Select two',
          },
        ],
      }
    },
    template: `
    <div>
      <div class="m-t">
        <label>Medium</label>
        <p-select placeholder="Please select">
          <option :value="item.value" v-for="(item, index) in items" :key="index">
          {{ item.text }}
          </option>
        </p-select>
      </div>
      <div class="m-t">
        <label>Default</label>
        <p-select placeholder="Please select">
          <option :value="item.value" v-for="(item, index) in items" :key="index">
          {{ item.text }}
          </option>
        </p-select>
      </div>
      <div class="m-t">
        <label>Small</label>
        <p-select placeholder="Please select" size="sm">
          <option :value="item.value" v-for="(item, index) in items" :key="index">
          {{ item.text }}
          </option>
        </p-select>
      </div>
    </div>
    `,
  }))
