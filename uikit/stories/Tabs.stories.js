import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PTabs from '../components/tabs/Tabs'
import PTabItem from '../components/tabs/TabItem'
import PCheckbox from '../components/switch/Switch'
import PButton from '../components/button/Button'
storiesOf('Tabs', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: {
      PTabs,
      PTabItem,
      PCheckbox,
      PButton,
    },
    template: `
    <section style="width: 50vw;">
        <p-button  @click="activeTab = 1">Set Music</p-button>
        <br><br>
        <p-checkbox v-model="showBooks"> Show Books item </p-checkbox>
        <br><br>
        <p-tabs v-model="activeTab" expanded>
            <p-tab-item label="Pictures">
                Lorem ipsum dolor sit amet.
            </p-tab-item>

            <p-tab-item label="Music">
                Lorem <br>
                ipsum <br>
                dolor <br>
                sit <br>
                amet.
            </p-tab-item>

            <p-tab-item :visible="showBooks" label="Books">
                What light is light, if Silvia be not seen? <br>
                What joy is joy, if Silvia be not by— <br>
                Unless it be to think that she is by <br>
                And feed upon the shadow of perfection? <br>
                Except I be by Silvia in the night, <br>
                There is no music in the nightingale.
            </p-tab-item>

            <p-tab-item label="Videos" disabled>
                Nunc nec velit nec libero vestibulum eleifend.
                Curabitur pulvinar congue luctus.
                Nullam hendrerit iaculis augue vitae ornare.
                Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
            </p-tab-item>
        </p-tabs>
    </section>`,
    data() {
      return {
        activeTab: 0,
        showBooks: false,
      }
    },
  }))
