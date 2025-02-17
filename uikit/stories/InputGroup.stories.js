import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Centered from '@storybook/addon-centered'
import PInput from '../components/input/Input'
import PIcon from '../components/icon/Icon'
storiesOf('InputGroup', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: {
      PInput,
      PIcon,
    },
    data() {
      return {
        basic: 'Default',
      }
    },
    methods: {
      onInput: action('On input'),
    },
    template: `
    <div class="example-wrap">
      <h4 class="example-title">Size</h4>
      <div class="form-group">
        <p-input size="lg" placeholder="Username">
          <span slot="prepend" class="input-group-text">@</span>
        </p-input>
      </div>
      <div class="form-group">
        <p-input placeholder="Username">
          <span slot="prepend" class="input-group-text">@</span>
        </p-input>
      </div>
      <div class="form-group">
        <p-input size="sm" placeholder="Username">
          <span slot="prepend" class="input-group-text">@</span>
        </p-input>
      </div>
    </div>
    `,
  }))
  .add('Addon', () => ({
    components: {
      PInput,
      PIcon,
    },
    template: `
    <div class="row">
      <div class="col-md-6">
        <div class="example-wrap">
          <h4 class="example-title">Text Addon</h4>
          <p>Place one add-on or button on either side of an input. You may
            also place one on both sides of an input.</p>
          <div class="form-group">
            <p-input
              placeholder="email"
              type="email"
            >
              <span class="input-group-text" slot="append">@example.com</span>
            </p-input>
          </div>
          <div class="form-group">
            <p-input type="text" placeholder="">
              <span slot="prepend" class="input-group-text">$</span>
            </p-input>
          </div>
          <div class="form-group">
            <p-input type="text" placeholder="">
              <span slot="prepend" class="input-group-text">$</span>
              <span slot="append" class="input-group-text">.00</span>
            </p-input>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="example-wrap">
          <h4 class="example-title">Icon Addon</h4>
          <p>Place icon instead of text in add-on on either side of an input.
          You may also place one on both sides of an input. </p>
          <div class="form-group">
            <p-input placeholder="Username">

            <div class="input-group-text" slot="prepend">
              <p-icon name="user"></p-icon>
            </div>
            </p-input>
          </div>
          <div class="form-group">
            <p-input type="email" placeholder="Email">
              <div slot="append" class="input-group-text">
                <p-icon name="envelope"></p-icon>
              </div>
            </p-input>
          </div>
        </div>
      </div>
    </div>
    `,
  }))
  .add('Form icons', () => ({
    components: {
      PInput,
      PIcon,
    },
    data() {
      return {
        sampleText: 'This text is clearable',
      }
    },
    template: `
    <div class="example-wrap">
      <h4 class="example-title">Form icons</h4>
      <div class="form-group">
        <p-input placeholder="Left icon" prefixIcon="map">
        </p-input>
      </div>
      <div class="form-group">
        <p-input placeholder="Right icon" suffixIcon="map">
        </p-input>
      </div>
      <div class="form-group">
        <p-input placeholder="Clear" clearable v-model="sampleText">
        </p-input>
      </div>
    </div>
    `,
  }))
