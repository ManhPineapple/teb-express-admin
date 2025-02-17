<template>
  <div class="page-loading" :class="{ 'is-loading': isLoading }">
    <div class="lds">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; display: block"
        width="100px"
        height="100px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <g transform="translate(26.666666666666668,26.666666666666668)">
          <rect x="-20" y="-20" width="40" height="40" fill="#696969">
            <animateTransform
              attributeName="transform"
              type="scale"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.1500000000000001;1"
              begin="-0.3s"
            ></animateTransform>
          </rect>
        </g>
        <g transform="translate(73.33333333333333,26.666666666666668)">
          <rect x="-20" y="-20" width="40" height="40" fill="#696969">
            <animateTransform
              attributeName="transform"
              type="scale"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.1500000000000001;1"
              begin="-0.2s"
            ></animateTransform>
          </rect>
        </g>
        <g transform="translate(26.666666666666668,73.33333333333333)">
          <rect x="-20" y="-20" width="40" height="40" fill="#696969">
            <animateTransform
              attributeName="transform"
              type="scale"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.1500000000000001;1"
              begin="0s"
            ></animateTransform>
          </rect>
        </g>
        <g transform="translate(73.33333333333333,73.33333333333333)">
          <rect x="-20" y="-20" width="40" height="40" fill="#696969">
            <animateTransform
              attributeName="transform"
              type="scale"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="1.1500000000000001;1"
              begin="-0.1s"
            ></animateTransform>
          </rect>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverLoading',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss">
// .lds-facebook {
//   display: inline-block;
//   position: relative;
//   width: 80px;
//   height: 80px;
// }
// .lds-facebook div {
//   display: inline-block;
//   position: absolute;
//   left: 8px;
//   width: 16px;
//   background: #76838f;
//   animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
// }
// .lds-facebook div:nth-child(1) {
//   left: 8px;
//   animation-delay: -0.24s;
// }
// .lds-facebook div:nth-child(2) {
//   left: 32px;
//   animation-delay: -0.12s;
// }
// .lds-facebook div:nth-child(3) {
//   left: 56px;
//   animation-delay: 0;
// }
// @keyframes lds-facebook {
//   0% {
//     top: 8px;
//     height: 64px;
//   }
//   50%,
//   100% {
//     top: 24px;
//     height: 32px;
//   }
// }

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.15);
  display: none;

  &.is-loading {
    display: block;
  }

  .lds {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
