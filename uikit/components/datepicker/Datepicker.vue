<template>
  <date-range-picker
    ref="picker"
    :opens="opens"
    :locale-data="localeData"
    :minDate="minDate"
    :maxDate="maxDate"
    :maxSpan="maxSpan"
    :singleDatePicker="singleDatePicker"
    :timePicker="timePicker"
    :timePicker24Hour="timePicker24Hour"
    :showWeekNumbers="showWeekNumbers"
    :showDropdowns="showDropdowns"
    :autoApply="autoApply"
    v-model="dateRange"
    @update="updateValues"
    @toggle="checkOpen"
    :linkedCalendars="linkedCalendars"
    :dateFormat="dateFormat"
    :close-on-esc="true"
    :ranges="listRanges"
    :time-picker-increment="timePickerIncrement"
  >
    <div slot="input" slot-scope="picker" style="width: 100%">
      <p-svg
        name="calendar"
        style="float: right; margin-left: 2px; margin-top: 6px"
      ></p-svg>
      <span
        class="label-date-picker"
        v-if="
          dateRange.startDate === dateRange.endDate &&
          dateRange.startDate === ''
        "
      >
        {{ label }}
      </span>
      <span
        class="label-date-picker"
        v-else-if="
          picker.startDate &&
          picker.endDate &&
          picker.startDate != picker.endDate &&
          !singleDatePicker
        "
      >
        {{ picker.startDate | date('dd/MM/yyyy') }} ~
        {{ picker.endDate | date('dd/MM/yyyy') }}
      </span>
      <span
        class="label-date-picker"
        v-else-if="
          dateRange.startDate &&
          dateRange.endDate &&
          picker.startDate != picker.endDate &&
          !singleDatePicker
        "
      >
        {{ dateRange.startDate | date('dd/MM/yyyy') }} ~
        {{ dateRange.endDate | date('dd/MM/yyyy') }}
      </span>
      <span
        v-else-if="timePicker && (dateRange.startDate || dateRange.endDate)"
      >
        {{
          dateRange.startDate ||
          dateRange.endDate | datetime('dd/MM/yyyy HH:mm:ss')
        }}</span
      >
      <span
        class="label-date-picker"
        v-else-if="
          singleDatePicker &&
          (dateRange.startDate || dateRange.endDate) &&
          label != 'dd/mm/yyyy'
        "
      >
        {{ dateRange.startDate || dateRange.endDate | date('dd/MM/yyyy') }}
      </span>
      <span class="label-date-picker" v-else>{{ label }}</span>
      <span
        class="clear-date"
        v-if="dateRange.startDate && dateRange.endDate"
        @click="clear"
      >
        <p-svg
          name="x-sm"
          style="
            float: right;
            margin-left: 2px;
            margin-top: 9px;
            margin-right: 2px;
          "
        ></p-svg>
      </span>
    </div>
  </date-range-picker>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
export { date, datetime } from '@core/utils/datetime'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  name: 'PDatepicker',
  components: { DateRangePicker },
  props: {
    value: {},
    label: {
      type: String,
      default: 'Date',
    },
    singleDatePicker: {
      type: Boolean,
      default: false,
    },
    timePicker: {
      type: Boolean,
      default: false,
    },
    opens: {
      type: String,
      default: 'left',
    },
    minDate: {
      type: [String, Date],
      default: '',
    },
    maxDate: {
      type: [String, Date],
      default: '',
    },
    maxSpan: {
      type: String,
      default: '',
    },
    timePicker24Hour: {
      type: Boolean,
      default: true,
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    showDropdowns: {
      type: Boolean,
      default: false,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    linkedCalendars: {
      type: Boolean,
      default: true,
    },
    dateFormat: {
      type: Function,
      default: null,
    },
    localeData: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
    timePickerIncrement: {
      type: Number,
      default: 5,
    },
    ranges: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateRange: {},
    }
  },
  computed: {
    textValue() {
      let text = ''
      if (!this.picker) {
        return ''
      }

      if (this.picker.startDate) {
        text = this.picker.startDate
      }

      if (this.picker.endDate) {
        text = `to ${this.picker.endDate}`
      }
      return text
    },
    listRanges() {
      if (!this.ranges) return false

      let today = new Date()
      today.setHours(0, 0, 0, 0)

      let yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      return {
        Today: [today, today],
        Yesterday: [yesterday, yesterday],
        'This month': [
          new Date(today.getFullYear(), today.getMonth(), 1),
          today,
        ],
        'This year': [new Date(today.getFullYear(), 0, 1), today],
        'Last month': [
          new Date(today.getFullYear(), today.getMonth() - 1, 1),
          new Date(today.getFullYear(), today.getMonth(), 0),
        ],
        'Last year': [
          new Date(today.getFullYear() - 1, 0, 1),
          new Date(today.getFullYear() - 1, 11, 31),
        ],
      }
    },
  },
  methods: {
    updateValues(e) {
      this.$emit('input', e)
      this.$emit('update', e)
    },
    checkOpen(e) {
      this.$emit('check-open', e)
    },
    clear() {
      this.dateRange = {}
      this.$emit('clear')
    },
  },
  watch: {
    value: {
      handler(v) {
        this.dateRange = v
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss">
.clear-date {
  position: relative;
  margin-top: 10px;
  margin-left: 3px;
  top: -1px;
}
</style>
