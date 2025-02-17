<template>
  <p-modal :active="visible" :title="`Promotion`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div class="select-user-receiver justify-content-between">
          <div>
            <b>Khách hàng:</b>
            <div class="user-select-box">
              <p-input
                placeholder="Tìm kiếm"
                prefixIcon="search"
                type="search"
                @keyup="updateSearch"
                v-model="search"
              >
              </p-input>
              <div class="list-user-select">
                <VclTable class="mt-20" v-if="isLoading"></VclTable>
                <ul v-else>
                  <li
                    :title="getTitleUser(item)"
                    :class="{ tick: checkedLeft.includes(item.id) }"
                    @click="setCheckedLeft(item)"
                    v-for="(item, i) in users"
                    :key="i"
                    ><template v-if="item.full_name"
                      >{{ item.full_name }} - </template
                    >{{ item.email }}</li
                  >
                </ul>
              </div>
            </div>
          </div>
          <div class="action">
            <div class="icon-container">
              <a href="#" @click.prevent="addAllUser">
                <p-svg name="add_all"></p-svg>
              </a>
              <a href="#" @click.prevent="addSelectedUser">
                <p-svg name="add"></p-svg>
              </a>
              <a href="#" @click.prevent="removeSelectedUser">
                <p-svg name="remove"></p-svg>
              </a>
              <a href="#" @click.prevent="removeAllUser">
                <p-svg name="remove_all"></p-svg>
              </a>
            </div>
          </div>
          <div>
            <b>Khách hàng áp dụng:</b>
            <div class="user-select-box" :class="{ error: receiverErr }">
              <p-input
                placeholder="Tìm kiếm"
                prefixIcon="search"
                type="search"
                v-model="searchSelected"
                @input="searchSelectUser"
              >
              </p-input>
              <div class="list-user-select">
                <ul>
                  <template v-if="searchSelected">
                    <li
                      :title="getTitleUser(item)"
                      :class="{ tick: checkedRight.includes(item.id) }"
                      @click="setCheckedRight(item)"
                      v-for="(item, i) in searchSelectedResult"
                      :key="i"
                      ><template v-if="item.full_name"
                        >{{ item.full_name }} - </template
                      >{{ item.email }}</li
                    >
                  </template>
                  <template v-else>
                    <li
                      :title="getTitleUser(item)"
                      :class="{ tick: checkedRight.includes(item.id) }"
                      @click="setCheckedRight(item)"
                      v-for="(item, i) in selected"
                      :key="i"
                      ><template v-if="item.full_name"
                        >{{ item.full_name }} - </template
                      >{{ item.email }}</li
                    >
                  </template>
                </ul>
              </div>
            </div>
            <i class="err-txt" v-if="receiverErr">{{ receiverErr }}</i>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose" :loading="isLoading">
          Bỏ qua
        </p-button>
        <p-button
          type="info"
          :loading="isLoading"
          @click="handleAppendPromotion"
        >
          Lưu
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import PInput from '../../../../uikit/components/input/Input'
import api from '@/packages/shared/api'
export default {
  name: 'ModalAppendPromotion',
  components: { PInput },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tester: {
      type: [Boolean, Number],
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    selectIDs() {
      return this.selected.map((i) => i.id)
    },
  },
  data() {
    return {
      promotion: this.data,
      receiverErr: '',
      search: '',
      searchSelected: '',
      searchSelectedResult: [],
      isLoading: false,
      users: [],
      selected: [],
      checkedLeft: [],
      checkedRight: [],
    }
  },
  methods: {
    getTitleUser(user) {
      if (user.full_name) {
        return `${user.full_name} - ${user.email}`
      }
      return ` ${user.email}`
    },
    async init() {
      this.isLoading = true
      let payload = {
        search: this.search,
        not_limit: true,
        status: 1,
        role: 'customer',
        tester: this.tester,
      }
      let response = await api.fetchUsersByRole(payload)
      this.isLoading = false
      if (response && response.errorMessage) {
        this.users = []
        return
      }
      let selectedIDs = this.promotion.user_ids || []
      this.selected = response.users.filter((i) => {
        return selectedIDs.indexOf(i.id) > -1
      })
      this.users = response.users.filter((i) => {
        return selectedIDs.indexOf(i.id) < 0
      })
      return
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateContent() {
      if (!this.selectIDs.length) {
        this.receiverErr = 'Khách hàng áp dụng không để trống'
        return false
      }
      this.receiverErr = ''
      return true
    },
    handleAppendPromotion() {
      if (!this.validateContent()) {
        return
      }
      let payload = {
        promotion_id: this.promotion.id,
        user_id: this.selectIDs,
        tester: Boolean(this.tester),
      }
      this.$emit('save', payload)
    },
    async updateSearch(e) {
      const search = e.target.value
      this.isLoading = true
      const result = await api.fetchUsersByRole({
        search: search.trim(),
        status: 1,
        role: 'customer',
        tester: this.tester,
      })
      this.isLoading = false

      if (result && result.errorMessage) {
        this.users = []
        return
      }
      this.users = result.users.filter((i) => {
        return !this.selectIDs.includes(i.id)
      })
    },
    setCheckedLeft(item) {
      const index = this.checkedLeft.indexOf(item.id)
      if (index > -1) {
        this.checkedLeft.splice(index, 1)
      } else {
        this.checkedLeft.push(item.id)
      }
    },
    setCheckedRight(item) {
      const index = this.checkedRight.indexOf(item.id)
      if (index > -1) {
        this.checkedRight.splice(index, 1)
      } else {
        this.checkedRight.push(item.id)
      }
    },
    addAllUser() {
      this.checkedLeft = this.users.map((user) => user.id)
      this.addSelectedUser()
    },
    removeAllUser() {
      this.checkedRight = this.selected.map((x) => x.id)
      this.removeSelectedUser()
    },
    addSelectedUser() {
      console.log(1)
      let checked = []
      this.users = this.users.filter((i) => {
        if (this.checkedLeft.includes(i.id) && this.selected.indexOf(i) < 0) {
          checked.push(i)
          return false
        }
        return true
      })
      this.selected = [...this.selected, ...checked]
      this.searchSelected = ''
    },
    removeSelectedUser() {
      let checked = []
      this.selected = this.selected.filter((i) => {
        if (this.checkedRight.includes(i.id) && this.users.indexOf(i) < 0) {
          checked.push(i)
          return false
        }
        return true
      })
      this.searchSelectedResult = this.searchSelectedResult.filter(
        (i) => checked.indexOf(i) < 0
      )
      this.users = [...this.users, ...checked]
    },
    searchSelectUser(search) {
      let reg = new RegExp(search, 'i')
      this.searchSelectedResult = this.selected.filter((item) => {
        return reg.test(item.email) || reg.test(item.full_name)
      })
    },
    initialData() {
      return {
        promotion: this.data,
        receiverErr: '',
        search: '',
        searchSelected: '',
        searchSelectedResult: [],
        isLoading: false,
        users: [],
        selected: [],
        checkedLeft: [],
        checkedRight: [],
      }
    },
  },
  watch: {
    visible: {
      handler: function (v) {
        if (v) {
          Object.assign(this.$data, this.initialData())
          this.init()
        }
      },
    },
  },
}
</script>
<style>
.p-modal-content label {
  margin-bottom: 0.4rem;
}
.action {
  padding-top: 40px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action svg {
  cursor: pointer;
  display: block;
  margin: 4px 0px;
}
.user-select-box {
  border: 1px solid #cfd0d0;
  border-radius: 8px;
  padding: 0 8px 8px 8px;
  margin-top: 5px;
}
.user-select-box.error {
  border: 1px solid #f5222d;
}
.user-select-box .input-group {
  margin-bottom: 2px;
}
.user-select-box .p-input-group .p-input-search {
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
  border-radius: unset !important;
}
.user-select-box .form-icons .form-control-icon {
  left: 10px;
}
.user-select-box .form-icons .form-control-icon-left + .form-control {
  padding-left: 32px;
}
.body-input {
  font-weight: 400;
  font-size: 14px !important;
  line-height: 20px;
  padding: 10px 16px !important;
}
.list-user-select {
  width: 241px;
  height: 164px;
  overflow-y: auto;
}
.list-user-select li {
  padding: 0 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: #313232;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.list-user-select li:hover,
.list-user-select li.tick {
  background-color: #edeeee;
}
.select-user-receiver {
  display: flex;
}
b {
  font-weight: 600;
  color: #111212;
}
.err-txt {
  color: #da1e28;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}
.list-user-select::-webkit-scrollbar-track {
  width: 4px;
  background: #fff;
}
.list-user-select::-webkit-scrollbar,
.list-user-select::-webkit-scrollbar-thumb {
  width: 4px;
  height: 80px;
  background: #e1e2e2;
  border-radius: 8px;
  cursor: pointer;
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: attr(data-value);
}
.list-notify-emails .checkbox-custom {
  position: static;
  margin-top: 3px;
}
.list-notify-emails .checkbox-custom label {
  margin-bottom: 2px;
  margin-left: 6px;
  padding-left: 6px;
}
.list-notify-emails .checkbox-custom label::before,
.list-notify-emails .checkbox-custom label::after {
  top: -2px;
}
</style>
