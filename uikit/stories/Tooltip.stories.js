import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PTooltip from '../components/tooltip/Tooltip'

storiesOf('Tooltip', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PTooltip },
    template: `
    <section>
      <p-tooltip label="Tooltip right" type="primary" position="right">
        <p-button type="primary">
          Right
        </p-button>
      </p-tooltip>
      <p-tooltip label="Tooltip top" type="black" position="top">
        <p-button type="default">
        Top (default)
        </p-button>
      </p-tooltip>
      <p-tooltip label="Tooltip bottom" type="success" position="bottom">
        <p-button type="success">
          Bottom
        </p-button>
      </p-tooltip>
      <p-tooltip label="Tooltip left" type="info" position="left">
        <p-button type="info">
          Left
        </p-button>
      </p-tooltip>
    </section>
  `,
  }))
