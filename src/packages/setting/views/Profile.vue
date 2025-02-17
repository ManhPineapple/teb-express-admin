<template>
  <div class="pages profile">
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="mb-16">
            <label class="font-weight-bold mb-4">Tên hiển thị:</label>
            <p-input
              class="mb-20"
              type="text"
              name="full_name"
              v-model.trim="full_name"
              placeholder="Nhập tên hiển thị"
              :error="valider.full_name"
              @input="clearErrors('full_name')"
            />
          </div>
          <div class="mb-16">
            <label class="font-weight-bold mb-4">Mật khẩu hiện tại:</label>
            <p-input
              class="mb-20"
              type="password"
              name="current_password"
              v-model.trim="currentPassword"
              placeholder="Nhập mật khẩu hiện tại"
              :error="valider.currentPassword"
              @input="clearErrors('currentPassword')"
              autocomplete="new-password"
            />
          </div>
          <div class="mb-16">
            <label class="font-weight-bold mb-4">Mật khẩu mới:</label>
            <p-input
              class="mb-20"
              type="password"
              name="new_password"
              v-model.trim="newPassword"
              placeholder="Nhập mật khẩu mới"
              :error="valider.newPassword"
              @input="clearErrors('newPassword')"
              autocomplete="new-password"
            />
          </div>
          <button
            class="btn btn-info mb-20"
            @click="submit"
            :disabled="isSubmitting"
            >Lưu</button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { UPDATE_PROFILE } from '@/packages/shared/store'

export default {
  data() {
    return {
      full_name: null,
      newPassword: '',
      currentPassword: '',
      valider: {},
      isSubmitting: false,
    }
  },
  computed: {
    ...mapState('shared', { user: (state) => state.user }),
  },
  methods: {
    ...mapActions('shared', {
      updateProfile: UPDATE_PROFILE,
    }),

    async submit() {
      if (!this.validate() || this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      const res = await this.updateProfile({
        full_name: this.full_name,
        current_password: this.currentPassword,
        new_password: this.newPassword,
      })

      this.isSubmitting = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Cập nhật thông tin thành công!')
      this.reset()
    },

    clearErrors(key) {
      if (key) {
        this.$set(this.valider, key, '')
      } else {
        this.valider = {}
      }
    },

    reset() {
      this.full_name = this.user.full_name
      this.newPassword = ''
      this.currentPassword = ''
      this.valider = {}
    },

    validate() {
      let isValid = true
      this.valider = {}

      if (this.full_name == '') {
        this.valider.full_name = 'Tên hiển thị là bắt buộc'
        isValid = false
      }

      if (this.newPassword == '' && this.currentPassword == '') {
        return isValid
      }

      if (this.currentPassword == '') {
        this.valider.currentPassword = 'Bạn chưa nhập mật khẩu hiện tại'
        isValid = false
      }

      if (this.newPassword == '') {
        this.valider.newPassword = 'Bạn chưa mật khẩu mới'
        isValid = false
      } else if (this.newPassword.length < 6) {
        this.valider.newPassword = 'Mật khẩu tối thiểu 6 ký tự'
        isValid = false
      }

      if (this.newPassword == this.currentPassword) {
        this.valider.newPassword =
          'Mật khẩu mới không được giống mật khẩu hiện tại'
        isValid = false
      }

      return isValid
    },
  },
  watch: {
    'user.full_name': {
      handler: function(val) {
        this.full_name = val
      },
      immediate: true,
    },
  },
}
</script>
<style></style>
