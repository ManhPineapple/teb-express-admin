<template>
  <tr>
    <td>{{ current.type_name }}</td>
    <td>{{ current.service_name }}</td>
    <td>{{ current.weight_text }}</td>
    <td>
      <input
        type="text"
        class="form-control"
        :value="price_value"
        @input="updateHandle"
        :disabled="user.role != ROLE_ADMIN"
      />
    </td>
  </tr>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { UPDATE_PRICE } from '../store'
import { ROLE_ADMIN } from '@core/constants'

export default {
  name: 'PriceItem',
  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      price_value: 0,
      ROLE_ADMIN: ROLE_ADMIN,
    }
  },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.price_value = this.current.price
  },
  methods: {
    ...mapMutations('setting', {
      updatePrice: UPDATE_PRICE,
    }),

    updateHandle(e) {
      let value = e.target.value.toString().trim()
      if (value == '') {
        e.target.value = 0
        return
      }

      value = value.replace(/^0*/, '')
      if (/^\d+\.?\d{0,2}$/gm.test(value)) {
        this.price_value = value
        this.updatePrice({ id: this.current.id, price: parseFloat(value) })
      }

      e.target.value = this.price_value
    },
  },
  watch: {
    'current.new_price': {
      handler: function(val) {
        this.price_value = val
      },
    },
  },
}
</script>

<style></style>
