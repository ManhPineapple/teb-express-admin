<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData: {
      handler: function () {
        this.renderChart(this.chartData, this.options)
      },
      deep: true,
    },
  },
}
</script>
