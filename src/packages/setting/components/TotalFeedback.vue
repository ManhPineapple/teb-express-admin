<template>
  <div class="card-block block-star">
    <div class="card-header">
      <div class="card-title">Phản hồi khách hàng</div>
    </div>
    <div class="card-body">
      <div class="avg">
        {{ avgStars }}
        <span
          >({{
            totalRatedTicket
              ? `${totalRatedTicket} đánh giá`
              : 'Chưa có đánh giá'
          }})</span
        >
      </div>
      <div class="detail-rate">
        <div class="row-detail" v-for="(star, i) in listStars" :key="i">
          <div class="label">{{ star }}.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :style="`width: ${getStarPercent(star)}%`"
              :aria-valuenow="getStarPercent(star)"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="number-rate">
            <span class="per">{{ getStarPercent(star) }}%</span>
            <span class="count">{{ getStarCount(star) }}</span>
          </div>
        </div>
      </div>
    </div>
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8L-6.99382e-07 1.39876e-06L6.68056 8.14731e-07L16 0L8 8Z"
        fill="white"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TotalFeedback',
  components: {},
  props: {
    tickets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalRatedTicket() {
      return this.tickets
        ? this.tickets.reduce(function (a, b) {
            return b.rating > 0 ? a + b.count : a
          }, 0)
        : 0
    },
    avgStars() {
      if (!this.totalRatedTicket) {
        return 0
      }
      const total = this.tickets.reduce(function (a, b) {
        return a + b.count * b.rating
      }, 0)
      return total / this.totalRatedTicket
    },
  },
  data() {
    return {
      listStars: [5, 4, 3, 2, 1],
    }
  },
  methods: {
    getStarCount(star) {
      if (!this.tickets) {
        return 0
      }
      return this.tickets.find((x) => x.rating === star)
        ? this.tickets.find((x) => x.rating === star).count
        : 0
    },
    getStarPercent(star) {
      if (!this.totalRatedTicket) {
        return 0
      }
      return Math.floor((this.getStarCount(star) * 100) / this.totalRatedTicket)
    },
  },
}
</script>
<style scoped lang="scss">
.block-star {
  min-width: 210px;
  border: 1px solid #edeeee;
  box-shadow: 0px 0px 2px rgba(17, 18, 18, 0.04),
    0px 4px 8px rgba(17, 18, 18, 0.08) !important;
  border-radius: 4px !important;
  padding: 16px !important;
  margin: unset;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: opacity 700ms ease, visibility 500ms ease;
  z-index: 9999;
  top: -160px;
  left: -50px;
  svg {
    position: absolute;
    content: '';
    opacity: 1;
    visibility: visible;
    pointer-events: none;
    bottom: -8px;
    left: 75%;
    transform: translateX(-75%);
  }
  .card-header {
    margin-bottom: 8px !important;
    .card-title {
      font-weight: 700 !important;
      font-size: 12px !important;
      line-height: 16px !important;
      color: #111212 !important;
      text-transform: unset !important;
      letter-spacing: unset !important;
    }
  }
  .avg {
    color: #111212;
    font-weight: 700;
    font-size: 24px;
    height: 28px;
    line-height: 28px;
    margin-bottom: 6px;
    span {
      font-weight: 400;
      font-size: 12px;
      font-weight: 400;
      color: #aaabab;
    }
  }
  .detail-rate {
    .progress {
      width: 100px;
      height: 8px;
      border-radius: 2px;
    }
    .progress-bar {
      background: #00b7b0;
      border-radius: 2px;
    }
    .row-detail {
      margin-bottom: 8px;
      position: relative;
      padding-left: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .label {
      position: absolute;
      left: -1px;
      top: -5px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      width: 12px;
      text-align: right;
      color: #aaabab;
    }
    .number-rate {
      position: absolute;
      left: 120px;
      top: -4px;
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      color: #313232;
      .per {
        display: inline-block;
        width: 28px;
      }
      .count {
        font-weight: 400;
        color: #aaabab;
        display: inline-block;
        min-width: 24px;
        margin-left: 4px;
      }
    }
  }
}
</style>
