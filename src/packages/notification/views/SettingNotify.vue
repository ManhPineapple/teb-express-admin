<template>
  <div class="list-notify-emails pages">
    <div class="page-content">
      <status-tab
        class="tab-type mb-16"
        v-model="tab"
        :status="listTab"
        :hasAll="false"
      />
      <notify-email v-if="isNotifyEmail"></notify-email>
      <notify-customer v-else> </notify-customer>
    </div>
  </div>
</template>
<script>
import NotifyCustomer from '../components/NotifyCustomer'
import NotifyEmail from '../components/NotifyEmail'
export default {
  name: 'SettingNotify',
  components: {
    NotifyCustomer,
    NotifyEmail,
  },
  data() {
    return {
      tab: 'notify_email',
      listTab: [
        {
          value: 'notify_email',
          text: 'thông báo',
        },
        {
          value: 'notify_customer',
          text: 'Thông báo khách hàng',
        },
      ],
    }
  },
  computed: {
    isNotifyEmail() {
      return this.tab === 'notify_email'
    },
  },
}
</script>
