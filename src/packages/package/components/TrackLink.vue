<template>
  <a target="_blank" class="on-hover" :href="link">
    {{ trackingNumber }}
  </a>
</template>
<script>
import { truncate } from '@core/utils/string'

export default {
  name: 'PackageTracking',
  props: {
    current: {
      type: Object,
      default: () => ({}),
    },
    isSmScreen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    trackingNumber() {
      if (!this.current) return ''
      if (this.current.tracking_number) return this.current.tracking_number
      if (this.current.tracking)
        return this.current.tracking.tracking_number || ''
      return ''
    },
    link() {
      const { service } = this.current
      if (
        service &&
        service.code &&
        service.code.toUpperCase().includes('FBA')
      ) {
        return `https://www.ups.com/track?trackingNumber=${this.trackingNumber}`
      }

      if (this.current.country_code == 'AU') {
        return `https://auspost.com.au/mypost/track/#/details/${this.trackingNumber}`
      }

      return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${this.trackingNumber}`
    },
  },
  methods: { truncate },
}
</script>
