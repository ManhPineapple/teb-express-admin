<template>
  <div class="dual-listbox">
    <div class="d-flex justify-content-between">
      <div class="listbox left">
        <p-input
          placeholder="Tìm kiếm"
          prefixIcon="search"
          type="search"
          :value="leftKeyword"
          @input="searchLeftHandle"
        />
        <div class="list-items">
          <VclTable class="mt-20" v-if="isLeftLoading"></VclTable>
          <ul v-else>
            <li
              :class="{ checked: item.checked }"
              @click="chooseLeftHandle(item)"
              v-for="item in displayLeftItems"
              :key="item.id"
            >
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="action">
        <div class="icon-container">
          <a
            href="#"
            @click.prevent="toRightAllHandle"
            :class="{ disabled: !isHasLeftAll }"
          >
            <p-svg name="add_all"></p-svg>
          </a>
          <a
            href="#"
            @click.prevent="toRightHandle"
            :class="{ disabled: !isHasLeft }"
          >
            <p-svg name="add"></p-svg>
          </a>
          <a
            href="#"
            @click.prevent="toLeftHandle"
            :class="{ disabled: !isHasRight }"
          >
            <p-svg name="remove"></p-svg>
          </a>
          <a
            href="#"
            @click.prevent="toLeftAllHandle"
            :class="{ disabled: !isHasRightAll }"
          >
            <p-svg name="remove_all"></p-svg>
          </a>
        </div>
      </div>
      <div class="listbox right">
        <p-input
          placeholder="Tìm kiếm"
          prefixIcon="search"
          type="search"
          :value="rightKeyword"
          @input="searchRightHandle"
        />
        <div class="list-items">
          <VclTable class="mt-20" v-if="isRightLoading"></VclTable>
          <ul v-else>
            <li
              :class="{ checked: item.checked }"
              @click="chooseRightHandle(item)"
              v-for="item in displayRightItems"
              :key="item.id"
            >
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep, debounce } from 'lodash'
function search(s, text) {
  return text.toLowerCase().indexOf(s.toLowerCase()) > -1
}

function score(s, text) {
  return Math.abs(s.length - text.length)
}

function trackValue(value, key) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return value[key]
}

export default {
  name: 'DualListbox',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    customLabel: {
      type: Function,
      default: (val) => val,
    },
    trackBy: {
      type: String,
    },
  },
  computed: {
    valueKeys() {
      if (this.trackBy) {
        return this.value.map((el) => el[this.trackBy])
      }

      return this.value
    },
    isHasLeftAll() {
      return this.leftItems && this.leftItems.length
    },
    isHasLeft() {
      return this.leftItems.some(({ checked }) => checked)
    },
    isHasRightAll() {
      return this.rightItems && this.rightItems.length
    },
    isHasRight() {
      return this.rightItems.some(({ checked }) => checked)
    },
  },
  data() {
    return {
      leftItems: [],
      displayLeftItems: [],
      rightItems: [],
      displayRightItems: [],
      selected: [],
      leftKeyword: '',
      rightKeyword: '',
      isLeftLoading: false,
      isRightLoading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.isLeftLoading = true
      this.isRightLoading = true
      const values = this.trackBy
        ? this.value.map((v) => trackValue(v, this.trackBy))
        : this.value
      const included = (x) =>
        this.trackBy ? values.includes(x[this.trackBy]) : values.includes(x)

      this.leftItems = this.options
        .filter((x) => !included(x))
        .map((v) => ({
          id: v.id,
          name: v.name,
          label: this.customLabel(v),
          checked: false,
        }))

      this.displayLeftItems = cloneDeep(this.leftItems)

      this.rightItems = this.options
        .filter((x) => included(x))
        .map((v) => ({
          id: v.id,
          name: v.name,
          label: this.customLabel(v),
          checked: false,
        }))

      this.displayRightItems = cloneDeep(this.rightItems)

      this.isLeftLoading = false
      this.isRightLoading = false
    },
    chooseLeftHandle(item) {
      item.checked = !item.checked
      const leftItem = this.leftItems.find(({ id }) => item.id == id)
      if (!leftItem) return

      leftItem.checked = item.checked
      this.$emit('on-left-choose', cloneDeep(item))
    },
    chooseRightHandle(item) {
      item.checked = !item.checked
      const rightItem = this.rightItems.find(({ id }) => item.id == id)
      if (!rightItem) return

      rightItem.checked = item.checked
      this.$emit('on-right-choose', cloneDeep(item))
    },
    searchLeftHandle: debounce(function (keyword) {
      this.isLeftLoading = true

      keyword = keyword.trim()
      this.leftKeyword = keyword

      if (keyword) {
        this.displayLeftItems = this.leftItems
          .filter(({ name }) => search(keyword, name))
          .sort(
            (a, b) =>
              score(keyword, a) - score(keyword, b) ||
              a.name.localeCompare(b.name)
          )
      } else {
        this.displayLeftItems = cloneDeep(this.leftItems)
      }

      this.isLeftLoading = false
    }, 300),
    searchRightHandle: debounce(function (keyword) {
      this.isRightLoading = true

      keyword = keyword.trim()
      this.rightKeyword = keyword

      if (keyword) {
        this.displayRightItems = this.rightItems
          .filter(({ name }) => name.search(keyword))
          .sort(
            (a, b) =>
              score(keyword, a) - score(keyword, b) ||
              a.name.localeCompare(b.name)
          )
      } else {
        this.displayRightItems = cloneDeep(this.rightItems)
      }

      this.isRightLoading = false
    }, 300),
    toRightAllHandle() {
      const checkedList = this.leftItems.map(({ id, name, label }) => ({
        id,
        name,
        label,
        checked: false,
      }))
      this.rightItems.push(...checkedList)
      this.leftItems = []

      this.displayLeftItems = []
      this.displayRightItems = cloneDeep(this.rightItems)
      this.leftKeyword = ''
      this.rightKeyword = ''

      this.onInput()
    },
    toRightHandle() {
      const checkedList = this.leftItems
        .filter(({ checked }) => checked)
        .map(({ id, name, label }) => ({ id, name, label, checked: false }))

      this.rightItems.push(...checkedList)
      this.leftItems = this.leftItems.filter(({ checked }) => !checked)

      this.displayLeftItems = cloneDeep(this.leftItems)
      this.displayRightItems = cloneDeep(this.rightItems)
      this.leftKeyword = ''
      this.rightKeyword = ''

      this.onInput()
    },
    toLeftHandle() {
      const checkedList = this.rightItems
        .filter(({ checked }) => checked)
        .map(({ id, name, label }) => ({ id, name, label, checked: false }))

      this.leftItems.push(...checkedList)
      this.rightItems = this.rightItems.filter(({ checked }) => !checked)

      this.displayLeftItems = cloneDeep(this.leftItems)
      this.displayRightItems = cloneDeep(this.rightItems)
      this.leftKeyword = ''
      this.rightKeyword = ''

      this.onInput()
    },
    toLeftAllHandle() {
      const checkedList = this.rightItems.map(({ id, name, label }) => ({
        id,
        name,
        label,
        checked: false,
      }))
      this.leftItems.push(...checkedList)
      this.rightItems = []

      this.displayLeftItems = cloneDeep(this.leftItems)
      this.displayRightItems = []
      this.leftKeyword = ''
      this.rightKeyword = ''

      this.onInput()
    },
    onInput() {
      const values = this.trackBy
        ? this.rightItems.map((v) => trackValue(v, this.trackBy))
        : cloneDeep(this.rightItems)
      this.$emit('input', values)
      this.$emit('change', values)
    },
  },
  watch: {
    value: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.dual-listbox {
  .action {
    padding: 8px;

    .icon-container {
      display: flex;
      flex-direction: column;

      a.disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      a + a {
        margin-top: 8px;
      }
    }
  }

  .listbox {
    flex: 1;
    border: 1px solid #cfd0d0;
    border-radius: 8px;

    input {
      margin-left: -1px;
      margin-right: -1px;
      margin-top: -1px;
    }
  }

  .list-items {
    overflow-y: scroll;
    height: 150px;

    li {
      cursor: pointer;
      padding: 5px 10px;
      font-weight: 400;
      font-size: 14px;
      line-height: 32px;

      &:hover,
      &.checked {
        background-color: #edeeee;
      }
    }
  }
}
</style>
