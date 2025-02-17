import { storiesOf } from '@storybook/vue'
import Centered from '@storybook/addon-centered'
import PAutocomplete from '../components/autocomplete/Autocomplete'

const data = [
  'Angular',
  'Angular 2',
  'Aurelia',
  'Backbone',
  'Ember',
  'jQuery',
  'Meteor',
  'Node.js',
  'Polymer',
  'React',
  'RxJS',
  'Vue.js',
]

storiesOf('Autocomplete', module)
  .addDecorator(Centered)
  .add('Basic', () => ({
    components: {
      PAutocomplete,
    },
    template: `
      <div>
        <p class="content"><b>Selected :</b> {{ selected }}</p>
        <p-autocomplete
          v-model="name"
          rounded
          :data="filteredDataArray"
          @select="option => selected = option"
          placeholder="Find a JS framework">
        </p-autocomplete>
      </div>`,
    data() {
      return {
        data,
        name: '',
        selected: null,
      }
    },
    computed: {
      filteredDataArray() {
        return this.data.filter((option) => {
          return (
            option
              .toString()
              .toLowerCase()
              .indexOf(this.name.toLowerCase()) >= 0
          )
        })
      },
    },
  }))
