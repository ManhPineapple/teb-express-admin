<template>
  <div class="pagination-box">
    <div class="select_limit_box" v-if="filterLimit">
      <span class="title">Bản ghi mỗi trang:</span>
      <div
        class="select_limit"
        :options="limitPageDisplay"
        :custom-label="customLabel"
        @change="handleSelect"
        @mouseleave="selectpage = false"
      >
        <span
          @click.prevent="selectpage = !selectpage"
          :class="{ icon_select: selectpage == true }"
          >{{ this.perPage }}
          <p-svg name="Frame"></p-svg>
        </span>
        <nav>
          <ul v-if="selectpage && !fixedLimit">
            <li
              v-for="(item, i) in limitPageDisplay"
              :key="i"
              :value="item.value"
              class="s_option"
              @click.prevent="handleSelect"
              :class="{ selected: item.value == perPage }"
              >{{ item.name }}</li
            >
          </ul>
        </nav>
      </div>

      <!--      <span>{{ this.total }}</span>-->
    </div>

    <nav>
      <ul
        class="p-pagination pagination pagination-gap"
        :class="rootClasses"
        v-if="!simple"
      >
        <li
          class="page-item button-page button-left"
          :class="{ disabled: !hasPrev }"
        >
          <a
            role="button"
            href="#"
            class="page-link"
            :class="{ disabled: !hasPrev }"
            :disabled="!hasPrev"
            @click.prevent="prev"
            :aria-label="ariaPreviousLabel"
          >
            <svgicon name="arrowright" class="text-white" />
          </a>
        </li>
        <!--First-->
        <li v-if="hasFirst" class="page-item">
          <a
            role="button"
            href="#"
            class="page-link"
            @click.prevent="first"
            :aria-label="getAriaPageLabel(1, false)"
          >
            1
          </a>
        </li>
        <li v-if="hasFirstEllipsis"
          ><span class="p-pagination-ellipsis">&hellip;</span></li
        >

        <!--Pages-->
        <li
          class="page-item"
          :class="{ active: page.isCurrent }"
          v-for="page in pagesInRange"
          :key="page.number"
        >
          <a
            role="button"
            href="#"
            class="page-link"
            @click.prevent="page.click"
            :aria-label="getAriaPageLabel(page.number, page.isCurrent)"
            :aria-current="page.isCurrent"
          >
            {{ page.number }}
          </a>
        </li>

        <!--Last-->
        <li v-if="hasLastEllipsis"
          ><span class="p-pagination-ellipsis">&hellip;</span></li
        >
        <li class="page-item" v-if="hasLast">
          <a
            role="button"
            href="#"
            class="page-link"
            @click.prevent="last"
            :aria-label="getAriaPageLabel(pageCount, false)"
          >
            {{ pageCount }}
          </a>
        </li>
        <li class="page-item button-page" :class="{ disabled: !hasNext }">
          <a
            role="button"
            href="#"
            class="page-link"
            :class="{ disabled: !hasNext }"
            :disabled="!hasNext"
            @click.prevent="next"
            :aria-label="ariaNextLabel"
          >
            <svgicon name="arrowright" class="text-white" />
          </a>
        </li>
      </ul>
      <small class="info" v-if="simple">
        <template v-if="perPage === 1">
          {{ firstItem }} / {{ total }}
        </template>
        <template v-else>
          {{ firstItem }}-{{ Math.min(current * perPage, total) }} / {{ total }}
        </template>
      </small>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'PPagination',
  props: {
    total: [Number, String],
    perPage: {
      type: [Number, String],
      default: 20,
    },
    current: {
      type: [Number, String],
      default: 1,
    },
    filterLimit: {
      type: Boolean,
      default: false,
    },
    size: String,
    simple: Boolean,
    rounded: Boolean,
    order: String,
    iconPack: String,
    ariaNextLabel: String,
    ariaPreviousLabel: String,
    ariaPageLabel: String,
    ariaCurrentLabel: String,
    fixedLimit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectpage: false,
      selected: {
        value: '20',
        name: '20',
      },
      limitPage: [
        {
          value: '20',
          name: '20',
        },
        {
          value: '30',
          name: '30',
        },
        {
          value: '50',
          name: '50',
        },
      ],
    }
  },
  computed: {
    rootClasses() {
      return [
        this.order,
        this.size ? `pagination-${this.size}` : '',
        {
          'is-simple': this.simple,
          'is-rounded': this.rounded,
        },
      ]
    },

    limitPageDisplay() {
      if (this.fixedLimit) {
        return this.limitPage.filter((e) => +e.value === this.perPage)
      } else {
        return this.limitPage
      }
    },
    // checkSelected(item) {
    //   return this.perPage == item ? 'checked': '';
    // },
    /**
     * Total page size (count).
     */
    pageCount() {
      return Math.ceil(this.total / this.perPage)
    },
    /**
     * First item of the page (count).
     */
    firstItem() {
      const firstItem = this.current * this.perPage - this.perPage + 1
      return firstItem >= 0 ? firstItem : 0
    },
    /**
     * Check if previous button is available.
     */
    hasPrev() {
      return this.current > 1
    },
    /**
     * Check if first page button should be visible.
     */
    hasFirst() {
      return this.current >= 3
    },
    /**
     * Check if first ellipsis should be visible.
     */
    hasFirstEllipsis() {
      return this.current >= 5
    },
    /**
     * Check if last page button should be visible.
     */
    hasLast() {
      return this.current <= this.pageCount - 2
    },
    /**
     * Check if last ellipsis should be visible.
     */
    hasLastEllipsis() {
      return this.current < this.pageCount - 3
    },
    /**
     * Check if next button is available.
     */
    hasNext() {
      return this.current < this.pageCount
    },
    /**
     * Get near pages, 1 before and 1 after the current.
     * Also add the click event to the array.
     */
    pagesInRange() {
      if (this.simple) {
        return
      }
      let left = Math.max(1, this.current - 1)
      if (left - 1 === 2) {
        left-- // Do not show the ellipsis if there is only one to hide
      }
      let right = Math.min(this.current + 1, this.pageCount)
      if (this.pageCount - right === 2) {
        right++ // Do not show the ellipsis if there is only one to hide
      }
      const pages = []
      for (let i = left; i <= right; i++) {
        pages.push({
          number: i,
          isCurrent: this.current === i,
          click: (event) => {
            if (this.current === i) {
              return
            }
            this.$emit('change', i)
            this.$emit('update:current', i)
            // Set focus on element to keep tab order
            this.$nextTick(() => event.target.focus())
          },
        })
      }
      return pages
    },
  },
  watch: {
    /**
     * If current page is trying to be greater than page count, set to last.
     */
    pageCount(value) {
      if (this.current > value) {
        this.last()
      }
    },
  },
  methods: {
    customLabel(value) {
      return value.name || '50'
    },
    handleSelect(e) {
      const value = e.target.value
      this.selectpage = false
      this.$emit('update:perPage', value)
      window.scrollTo(0, 0)
      this.$router
        .push({ query: { limit: value, page: this.current } })
        .catch(() => {})
    },
    /**
     * Previous button click listener.
     */
    prev() {
      if (!this.hasPrev) {
        return
      }
      this.$emit('change', this.current - 1)
      this.$emit('update:current', this.current - 1)
    },
    /**
     * First button click listener.
     */
    first() {
      this.$emit('change', 1)
      this.$emit('update:current', 1)
    },
    /**
     * Last button click listener.
     */
    last() {
      this.$emit('change', this.pageCount)
      this.$emit('update:current', this.pageCount)
    },
    /**
     * Next button click listener.
     */
    next() {
      if (!this.hasNext) {
        return
      }
      this.$emit('change', this.current + 1)
      this.$emit('update:current', this.current + 1)
    },
    /**
     * Get text for aria-label according to page number.
     */
    getAriaPageLabel(pageNumber, isCurrent) {
      if (this.ariaPageLabel && (!isCurrent || !this.ariaCurrentLabel)) {
        return this.ariaPageLabel + ' ' + pageNumber + '.'
      } else if (this.ariaPageLabel && isCurrent && this.ariaCurrentLabel) {
        return (
          this.ariaCurrentLabel +
          ', ' +
          this.ariaPageLabel +
          ' ' +
          pageNumber +
          '.'
        )
      }
      return null
    },
  },
}
</script>
