<template>
  <div class="modal" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Export Transactions</h2>
      </div>
      <div class="input-row">
        <div class="input-group">
          <label for="user-input">Select User</label>
          <div class="user-input-wrapper">
            <input
              id="user-input"
              v-model="searchQuery"
              @input="filterUsers"
              @focus="showDropdown = true"
              placeholder="Search user..."
              class="user-input"
            />
            <ul v-if="showDropdown" class="user-dropdown">
              <li
                v-for="user in filteredUsers"
                :key="user.id"
                @click="selectUser(user)"
                class="dropdown-item"
              >
                {{ user.full_name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="input-group">
          <label for="date-search">Select Date</label>
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group"
            @update="selectDate"
            :label="labelDate"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
          ></p-datepicker>
        </div>
      </div>
      <div class="button-row">
        <button @click="exportData" class="export-button">Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import sharedApi from '@/packages/shared/api'
import { date } from '@core/utils/datetime'
import * as XLSX from 'xlsx'
import api from '../api'
import {
  TransactionLogTypePay,
  TransactionLogTypePayoneer,
  TransactionLogTypePingPong,
  TransactionLogTypeRefund,
  TransactionLogTypeTopup,
} from '../constants'

export default {
  data() {
    return {
      users: [],
      filteredUsers: [],
      typePay: TransactionLogTypePay,
      searchQuery: '',
      showDropdown: false,
      labelDate: `Tìm theo ngày`,
      filter: {
        search: null,
        start_date: '',
        end_date: '',
      },
    }
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const payload = {
          search: '',
          not_limit: true,
          status: 1,
          role: 'customer',
          tester: false,
        }
        let response = await sharedApi.fetchUsersByRole(payload)
        this.users = response.users
        this.filteredUsers = response.users
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    filterUsers() {
      this.filteredUsers = this.users.filter((user) =>
        user.full_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    selectUser(user) {
      this.filter.search = user.full_name
      this.searchQuery = user.full_name
      this.showDropdown = false
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },

    closeModal() {
      this.$emit('close')
    },

    async exportData() {
      const payload = {
        type: 1,
        status: 2,
        search_by: 'account_full_name',
        page: 1,
        limit: 10000,
        ...this.filter,
        search: this.filter.search,
      }

      try {
        let response = await api.fetchTransactionLogs(payload)

        const headers = [
          'Ngày tạo',
          'Trạng thái',
          'Khách hàng',
          'Nội dung',
          'Hình thức',
          'Giá trị',
          'Người xác nhận',
        ]

        const data = response.transactions.map((item) => [
          this.formatDate(item.created_at), // Column 1: Ngày tạo
          this.mapStatus(item.status), // Column 2: Trạng thái
          (item.user && item.user.full_name) || '', // Column 3: Khách hàng
          this.getDescription(item) || '', // Column 4: Nội dung
          this.getTextType(item) || '', // Column 5: Hình thức
          item.type === this.typePay
            ? '- ' + this.formatPrice(item.amount) // Column 6: Giá trị
            : '+ ' + this.formatPrice(item.amount),
          (item.admin && item.admin.full_name) || '', // Column 7: Người xác nhận
        ])

        const worksheetData = [headers, ...data]
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

        // format xlsx cols width
        const colWidths = headers.map((header, i) => {
          const maxLength = Math.max(
            ...data.map((row) => (row[i] ? row[i].toString().length : 10)) // Default min width 10
          )
          return { wch: maxLength + 2 }
        })
        worksheet['!cols'] = colWidths

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
        XLSX.writeFile(workbook, 'transactions_export.xlsx')

        // Close the modal
        this.closeModal()
      } catch (error) {
        console.error('Error exporting transactions:', error)
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-GB')
    },

    mapStatus(status) {
      const statusMap = { 1: 'Chờ xác nhận', 2: 'Thành công', 3: 'Thất bại' }
      return statusMap[status] || ''
    },

    getDescription(transaction) {
      let path = ''
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `Nạp topup #${transaction.id}`
        case TransactionLogTypePay:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { code: transaction.bill.code },
          }).href
          return `Thanh toán hóa đơn <a href="${path}">#${transaction.bill.code}</a>`
        case TransactionLogTypeRefund:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { code: transaction.bill.code },
          }).href
          return `Hoàn tiền  hóa đơn <a href="${path}">#${transaction.bill.code}</a>`
        case TransactionLogTypePayoneer:
          return `#${transaction.description}`
        case TransactionLogTypePingPong:
          return `#${transaction.description}`
        default:
          return null
      }
    },

    getTextType(transaction) {
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return 'Chuyển khoản'
        case TransactionLogTypePayoneer:
          return `Payoneer`
        case TransactionLogTypePingPong:
          return `PingPong`
        default:
          return 'N/A'
      }
    },

    formatPrice(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(value))
    },
  },
}
</script>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  min-width: 450px;
  max-width: 750px;
  color: black;
}

.modal-header {
  background-color: #00978c;
  color: white;
  padding: 15px;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.input-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin: 20px 0;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

.user-input-wrapper {
  position: relative;
}

.user-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.export-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  float: right;
}

.export-button:hover {
  background-color: #0056b3;
}
</style>
