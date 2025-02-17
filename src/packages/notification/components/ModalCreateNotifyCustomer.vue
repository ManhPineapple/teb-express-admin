<template>
  <p-modal :active="visible" :title="`Tạo thông báo`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Tiêu đề</b></label>
          <i class="err-txt" v-if="titleErr">{{ titleErr }}</i>
        </div>
        <p-input
          :class="{ error: titleErr }"
          type="text"
          class="tilte_noti"
          @input="validateTilteNotify"
          placeholder="Nhập tiêu đề thông báo"
          v-model="title"
        ></p-input>
        <span class="count-title"
          >{{ title.length }}/{{ maxStrLengthTitle }}</span
        >
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label class="color-newtral-10 mb-5"><b>Loại thông báo:</b></label>
          <i class="err-txt" v-if="typeErr">{{ typeErr }}</i>
        </div>
      </div>
      <div class="col-6">
        <multiselect
          :class="{ error: typeErr }"
          placeholder="Chọn loại"
          v-model="type"
          label="text"
          track-by="value"
          :options="types"
        >
        </multiselect>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Người nhận:</b></label>
          <i class="err-txt" v-if="receiverErr">{{ receiverErr }}</i>
        </div>
        <p-checkbox v-model="isSendAll" @input="checkSendAll"
          >Gửi tất cả</p-checkbox
        >
        <div class="select-user-receiver justify-content-between">
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
          <div class="action">
            <div class="icon-container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="addSelectedUser"
              >
                <rect width="32" height="32" rx="4" fill="#EDEEEE" />
                <path
                  d="M18.4299 9.92999L24.4999 16L18.4299 22.07"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 16H24.33"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="removeSelectedUser"
              >
                <rect width="32" height="32" rx="4" fill="#EDEEEE" />
                <path
                  d="M13.57 9.92999L7.5 16L13.57 22.07"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24.4999 16H7.66992"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
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
                    >{{ item.email }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Nội dung:</b></label>
          <i class="err-txt" v-if="bodyErr">{{ bodyErr }}</i>
        </div>
        <textarea
          class="form-control"
          :class="{ error: bodyErr }"
          rows="4"
          v-model="body"
        ></textarea>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Link</b></label>
          <i class="err-txt" v-if="linkErr">{{ linkErr }}</i>
        </div>
        <p-input
          class="tilte_noti"
          @input="validateLink"
          placeholder="Nhập đường dẫn"
          v-model="link"
        >
        </p-input>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button
          type="default"
          @click="handleSaveNoti"
          :disabled="disableAction"
          :loading="isLoading"
        >
          Lưu
        </p-button>
        <p-button
          type="info"
          :loading="isLoading"
          @click="handleSendNoti"
          :disabled="disableAction"
        >
          Gửi
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import PInput from '../../../../uikit/components/input/Input'
import api from '@/packages/shared/api'
import S3Service from '@core/services/s3'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { NOTIFY_NOT_PROCESSED, NOTIFY_TYPE } from '../constant'
import { cloneDeep } from '@core/utils'
export default {
  name: 'ModalCreateNotifyCustomer',
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
    showDetail: {
      type: Boolean,
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
    disableAction() {
      return (
        (this.showDetail && this.notify.status !== NOTIFY_NOT_PROCESSED) ||
        !this.enableAction
      )
    },
  },
  data() {
    return {
      types: NOTIFY_TYPE,
      notify: this.data,
      enableAction: true,
      maxStrLengthTitle: 50,
      titleErr: '',
      bodyErr: '',
      typeErr: '',
      linkErr: '',
      type: '',
      link: '',
      receiverErr: '',
      title: '',
      body: '',
      search: '',
      searchSelected: '',
      searchSelectedResult: [],
      isLoading: false,
      users: [],
      selected: [],
      checkedLeft: [],
      checkedRight: [],
      isSendAll: false,
      editorOption: {
        debug: 'false',
        placeholder: 'Nhập nội dung',
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [
                { font: [] },
                { size: ['12px', '14px', '16px', '18px', '20px'] },
              ],

              ['bold', 'italic', 'underline', 'strike'],

              [{ color: [] }, { background: [] }],

              [{ script: 'sub' }, { script: 'super' }],

              [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],

              [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
              ],

              [{ direction: 'rtl' }, { align: [] }],

              ['link', 'image', 'formula'],

              ['clean'],
            ],
            handlers: {
              image: this.imageHandler,
            },
          },
        },
      },
    }
  },
  methods: {
    getTitleUser(user) {
      if (user.full_name) {
        return `${user.full_name} - ${user.email}`
      }
      return ` ${user.email}`
    },
    imageHandler() {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = async function () {
        const file = input.files[0]
        let r = await S3Service.upload('static', file)
        let quill = this.$refs.editor.quill
        const range = quill.getSelection()
        quill.insertEmbed(
          range.index,
          'image',
          `${process.env.VUE_APP_ASSETS}/${r.url}`
        )
      }.bind(this)
    },
    initialData() {
      return {
        notify: this.data,
        enableAction: true,
        maxStrLengthTitle: 100,
        titleErr: '',
        bodyErr: '',
        receiverErr: '',
        typeErr: '',
        linkErr: '',
        title: '',
        body: '',
        link: '',
        type: '',
        search: '',
        searchSelected: '',
        searchSelectedResult: [],
        isLoading: false,
        users: [],
        selected: [],
        checkedLeft: [],
        checkedRight: [],
        isSendAll: false,
        editorOption: {
          debug: 'false',
          placeholder: 'Nhập nội dung',
          theme: 'snow',
          modules: {
            toolbar: {
              container: [
                [
                  { font: [] },
                  { size: ['12px', '14px', '16px', '18px', '20px'] },
                ],

                ['bold', 'italic', 'underline', 'strike'],

                [{ color: [] }, { background: [] }],

                [{ script: 'sub' }, { script: 'super' }],

                [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],

                [
                  { list: 'ordered' },
                  { list: 'bullet' },
                  { indent: '-1' },
                  { indent: '+1' },
                ],

                [{ direction: 'rtl' }, { align: [] }],

                ['link', 'image', 'formula'],

                ['clean'],
              ],
              handlers: {
                image: this.imageHandler,
              },
            },
          },
        },
      }
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
      if (this.showDetail) {
        const selectedIDs = this.notify.user_ids
        this.selected = response.users.filter((i) => {
          return selectedIDs.indexOf(i.id) > -1
        })
        this.users = response.users.filter((i) => {
          return selectedIDs.indexOf(i.id) < 0
        })
        return
      }
      this.users = response.users
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateTilteNotify(e) {
      if (e.length > this.maxStrLengthTitle) {
        this.enableAction = false
        this.titleErr = `Tiêu đề không vượt quá ${this.maxStrLengthTitle} ký tự`
        this.title = e.slice(0, -1)
      } else {
        this.titleErr = ''
        this.enableAction = true
      }
    },
    checkSendAll(v) {
      if (v) {
        let checked = cloneDeep(this.selected)
        this.selected = []
        this.users = [...this.users, ...checked]
        this.checkedLeft = this.checkedRight = []
      }
    },
    validateContent() {
      if (this.title == '') {
        this.titleErr = 'Tiêu đề không được để trống'
      } else {
        this.titleErr = ''
      }

      if (!this.type) {
        this.typeErr = 'Chưa chọn loại notify'
      } else {
        this.typeErr = ''
      }

      if (this.body == '') {
        this.bodyErr = 'Nội dung không được để trống'
      } else {
        this.bodyErr = ''
      }
      if (!this.isSendAll && !this.selectIDs.length) {
        this.receiverErr = 'Người nhận không để trống'
      } else {
        this.receiverErr = ''
      }
      return (
        this.bodyErr === '' &&
        this.titleErr === '' &&
        this.receiverErr === '' &&
        this.typeErr === '' &&
        this.linkErr === ''
      )
    },
    handleSaveNoti() {
      if (!this.validateContent()) {
        return
      }
      let payload = {
        id: this.notify ? this.notify.id : 0,
        ids: this.selectIDs,
        title: this.title,
        body: this.body,
        is_send: false,
        is_send_all: this.isSendAll,
        type: this.type ? parseInt(this.type.value) : 0,
        link: this.link,
      }
      this.$emit('save', payload)
    },
    handleSendNoti() {
      if (!this.validateContent()) {
        return
      }
      let payload = {
        id: this.notify ? this.notify.id : 0,
        ids: this.selectIDs,
        title: this.title,
        body: this.body,
        is_send: true,
        is_send_all: this.isSendAll,
        type: this.type ? parseInt(this.type.value) : 0,
        link: this.link,
      }
      this.$emit('save', payload)
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
    addSelectedUser() {
      this.isSendAll = false
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
      this.isSendAll = false
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
    validateLink(link) {
      const urlregex =
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
      if (link.trim() !== '' && !urlregex.test(link.trim())) {
        this.linkErr = 'Đường dẫn không hợp lệ'
      } else {
        this.linkErr = ''
      }
    },
  },
  watch: {
    visible: {
      handler: function (v) {
        if (v) {
          Object.assign(this.$data, this.initialData())
          if (this.showDetail) {
            this.title = this.notify.title
            this.body = this.notify.body
            this.link = this.notify.link
            this.isSendAll = Boolean(this.notify.is_send_all)
            this.type = this.types.find(
              (item) => this.notify.type === item.value
            )
          } else {
            this.notify = {}
          }
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
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action svg {
  cursor: pointer;
  display: block;
  margin: 8px 0px;
}

.user-select-box {
  border: 1px solid #cfd0d0;
  border-radius: 8px;
  padding: 0 8px 8px 8px;
}

.user-select-box.error,
textarea.error {
  border: 1px solid #f5222d;
}

.multiselect.error .multiselect__tags {
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
