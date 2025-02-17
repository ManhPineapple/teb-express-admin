<template>
  <span
    :data-label="label"
    :class="[
      internalType,
      `is-${position}`,
      `is-${size}`,
      {
        'p-tooltip': active,
        'is-square': square,
        'is-animated': internalAnimated,
        'is-always': always,
        'is-multiline': multilined,
        'is-dashed': dashed,
      },
    ]"
    :style="{ 'transition-delay': `${internalDelay}ms` }"
  >
    <slot />
  </span>
</template>

<script>
import config from '../../config'

export default {
  name: 'PTooltip',
  props: {
    active: {
      type: Boolean,
      default: true,
    },
    type: String,
    label: String,
    position: {
      type: String,
      default: 'top',
      validator(value) {
        return (
          ['top', 'bottom', 'left', 'right', 'bottom-left'].indexOf(value) > -1
        )
      },
    },
    always: Boolean,
    animated: Boolean,
    square: Boolean,
    dashed: Boolean,
    multilined: Boolean,
    size: {
      type: String,
      default: 'medium',
    },
    delay: Number,
  },
  computed: {
    internalType() {
      return `is-${this.type}` || config.defaultTooltipType
    },
    internalAnimated() {
      return this.animated || config.defaultTooltipAnimated
    },
    internalDelay() {
      return this.delay || config.defaultTooltipDelay
    },
  },
}
</script>
