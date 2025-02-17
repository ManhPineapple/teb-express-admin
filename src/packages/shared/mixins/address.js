export default {
  computed: {
    city() {
      if (!this.senderEditing.city) {
        return {}
      }
      const cityFound = this.cities.find(
        ({ Name }) => Name === this.senderEditing.city
      )

      if (!cityFound) {
        this.senderEditing.district = ''
        this.senderEditing.wards = ''
      }

      return cityFound || {}
    },
    districts() {
      return this.city !== {} ? this.city['Districts'] : []
    },
    district() {
      if (!this.districts) {
        return {}
      }
      const districtFound = this.districts.find(
        (element) => element.Name === this.senderEditing.district
      )
      if (!districtFound) {
        this.senderEditing.district = ''
        this.senderEditing.wards = ''
      }
      return districtFound || {}
    },
    wards() {
      if (!this.senderEditing.district || !this.district) {
        return {}
      }

      if (this.district === {}) {
        return []
      }
      let wardArr = this.district['Wards']
      const wardsFound = wardArr.find(
        (element) => element.Name === this.senderEditing.wards
      )
      if (!wardsFound) {
        this.senderEditing.wards = ''
      }
      return this.district['Wards']
    },
  },
}
