import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Centered from '@storybook/addon-centered'
import PButton from '../components/button/Button'
import PIcon from '../components/icon/Icon'
storiesOf('Button', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PButton },
    methods: {
      click: action('on click'),
    },
    template: `
      <div>
        <p-button type="default" @click="click">Default</p-button>
        <p-button type="primary">Primary</p-button>
        <p-button type="success">Success</p-button>
        <p-button type="info">Info</p-button>
        <p-button type="warning">Warning</p-button>
        <p-button type="danger">Danger</p-button>
      </div>
    `,
  }))
  .add('Size', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button size="lg">Large</p-button>
        <p-button type="success">Medium</p-button>
        <p-button type="primary">Default</p-button>
        <p-button type="info" size="sm">Small</p-button>
      </div>
    `,
  }))
  .add('Outline', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button type="default" outline>Default</p-button>
        <p-button type="primary" outline>Primary</p-button>
        <p-button type="success" outline>Success</p-button>
        <p-button type="info" outline>Info</p-button>
        <p-button type="warning" outline>Warning</p-button>
        <p-button type="danger" outline>Danger</p-button>
      </div>
    `,
  }))
  .add('Rounded', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button type="default" round>Default</p-button>
        <p-button type="primary" round>Primary</p-button>
        <p-button type="success" round>Success</p-button>
        <p-button type="info" round>Info</p-button>
        <p-button type="warning" round>Warning</p-button>
        <p-button type="danger" round>Danger</p-button>
      </div>
    `,
  }))
  .add('Floating', () => ({
    components: { PButton, PIcon },
    template: `
      <div>
        <p-button type="default" floating><p-icon name="plus"></p-icon></p-button>
        <p-button type="primary" floating><p-icon name="plus"></p-icon></p-button>
        <p-button type="success" floating><p-icon name="plus"></p-icon></p-button>
        <p-button type="info" floating><p-icon name="plus"></p-icon></p-button>
        <p-button type="warning" floating><p-icon name="plus"></p-icon></p-button>
        <p-button type="danger" floating><p-icon name="plus"></p-icon></p-button>
      </div>
    `,
  }))
  .add('Raised', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button type="default" raised>Default</p-button>
        <p-button type="primary" raised>Primary</p-button>
        <p-button type="success" raised>Success</p-button>
        <p-button type="info" raised>Info</p-button>
        <p-button type="warning" raised>Warning</p-button>
        <p-button type="danger" raised>Danger</p-button>
      </div>
    `,
  }))
  .add('Flat', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button type="default" flat>Default</p-button>
        <p-button type="primary" flat>Primary</p-button>
        <p-button type="success" flat>Success</p-button>
        <p-button type="info" flat>Info</p-button>
        <p-button type="warning" flat>Warning</p-button>
        <p-button type="danger" flat>Danger</p-button>
      </div>
    `,
  }))
  .add('Loading', () => ({
    components: { PButton },
    template: `
      <div>
        <p-button type="default" loading>Proceeding</p-button>
        <p-button type="danger" loading>Proceeding</p-button>
        <p-button type="primary" loading>Proceeding</p-button>
        <p-button type="warning" loading>Proceeding</p-button>
        <p-button type="primary" loading>Primary</p-button>
        <p-button type="success" loading>Success</p-button>
        <p-button type="warning" loading>Warning</p-button>
      </div>
    `,
  }))
