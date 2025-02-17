import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PDropdown from '../components/dropdown/Dropdown'
import PDropdownItem from '../components/dropdown/DropdownItem'
import PIcon from '../components/icon/Icon'
import PButton from '../components/button/Button'
storiesOf('Dropdown', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: { PDropdown, PDropdownItem, PIcon, PButton },
    template: `
      <div class="d-flex">
        <p-dropdown>
          <p-button type="primary" slot="trigger" class="dropdown-toggle">
            <span>Click me!</span>
            <p-icon name="menu-down"></p-icon>
          </p-button>
          <p-dropdown-item>Action</p-dropdown-item>
          <p-dropdown-item>Another action</p-dropdown-item>
          <p-dropdown-item>Something else</p-dropdown-item>
        </p-dropdown>

        <p-dropdown hoverable>
          <p-button type="primary" slot="trigger" class="dropdown-toggle">
            <span>Hover me!</span>
            <p-icon icon="menu-down"></p-icon>
          </p-button>
          <p-dropdown-item>Action</p-dropdown-item>
          <p-dropdown-item>Another action</p-dropdown-item>
          <p-dropdown-item>Something else</p-dropdown-item>
        </p-dropdown>

        <p-dropdown :disabled="true">
          <p-button type="primary" slot="trigger" class="dropdown-toggle">
            <span>Disabled</span>
            <p-icon icon="menu-down"></p-icon>
          </p-button>
          <p-dropdown-item>Action</p-dropdown-item>
        </p-dropdown>

        <p-dropdown position="top-right">
          <p-button type="primary" slot="trigger" class="dropdown-toggle">
            <span>Custom position</span>
            <p-icon icon="menu-down"></p-icon>
          </p-button>
          <p-dropdown-item disabled>Action</p-dropdown-item>
          <p-dropdown-item>Another action</p-dropdown-item>
          <p-dropdown-item>Something else</p-dropdown-item>
        </p-dropdown>

        <p-dropdown>
          <p class="tag is-success" slot="trigger">
            Custom trigger
          </p>
          <p-dropdown-item>Action</p-dropdown-item>
        </p-dropdown>
      </div>
    `,
  }))
