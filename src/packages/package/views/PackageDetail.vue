<template>
  <div class="package-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-package' }" class="text">
            <span class="page-header_back_icon">
              <p-svg name="chevron-left"></p-svg>
            </span>
            <span>Quản lý vận đơn</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div
            class="page-header__info grib_header"
            :class="{ 'three-col': package_detail.estimate_process_date }"
          >
            <div>
              <div>AnanBay tracking</div>
              <div class="package-code">
                <template v-if="showPackageCode(this.package_detail.package)">
                  {{
                    $evaluate('package_detail.package.package_code?.code') ||
                    'N/A'
                  }}
                </template>
                <template v-else>N/A</template>
              </div>
            </div>
            <div>
              <div>Khách hàng </div>
              <div>{{
                $evaluate('package_detail.package.user ?.full_name')
              }}</div>
            </div>
            <div>
              <div>Dịch vụ </div>
              <div>{{ $evaluate('package_detail.package.service?.name') }}</div>
            </div>
            <div v-if="package_detail.package.tracking">
              <div>Last mile tracking </div>
              <div>
                <track-link :current="package_detail.package" />
              </div>
            </div>
            <div>
              <div>Ngày tạo</div>
              <div>{{
                package_detail.package.created_at
                  | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
            <div v-if="package_detail.estimate_process_date">
              <div>Ngày xử lý dự kiến </div>
              <div>
                {{
                  package_detail.estimate_process_date
                    | datetime('dd/MM/yyyy HH:mm:ss')
                }}
              </div>
            </div>
            <div v-if="package_detail.package.estimate_delivery > 0">
              <div>Thời gian dự kiên</div>
              <div>{{ package_detail.package.estimate_delivery | toDay }}</div>
            </div>
          </div>
          <div class="page-header__action">
            <p-button
              type="danger"
              class="btn btn-danger"
              @click="handleCancelPackage"
              v-if="isHasCancel"
              id="btn_cancel"
            >
              <span>Hủy đơn</span>
            </p-button>
            <p-button
              type="info"
              v-if="showButtonEdit"
              @click="handleModal"
              id="btn_edit"
            >
              {{ isReturnPackage ? `Re-Ship` : `Sửa đơn` }}
            </p-button>
            <p-button
              type="info"
              v-if="
                package_detail.package.status != statusCreated &&
                package_detail.package.status != statusArchived &&
                user.role != roleSupport &&
                user.role != roleSale &&
                !$isWarehouse() &&
                !$isShipPartner() &&
                !$isSaleOperation()
              "
              @click="showModalExtraFee"
              id="btn_ex_fee"
            >
              Tạo phí phát sinh
            </p-button>
            <p-button
              type="info"
              @click="showModalCreateTracking"
              v-if="showBtnCreateTracking"
              id="btn_create_tracking"
            >
              Thêm hành trình
            </p-button>
            <p-button
              type="info"
              @click="downloadLabelFile"
              v-if="
                package_detail.package.status != statusCreated &&
                package_detail.package.status != statusArchived
              "
              id="btn_print_label"
            >
              In label
            </p-button>
            <p-button
              type="info"
              @click="handlePurchased"
              v-if="showBtnCnPrePurchased"
              id="btn_CN_prepurchased"
            >
              Chuyển đơn sang đã mua
            </p-button>
            <p-button
              type="info"
              @click="createLabel"
              v-if="showBtnCnPurchased"
              id="btn_create_label"
            >
              Tạo theo dõi đơn
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="">
          <div class="">
            <div class="row">
              <div class="col-6">
                <div class="row mb-24">
                  <div class="col">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Người nhận</div>
                      </div>
                      <div class="card-content">
                        <div class="row">
                          <div class="col-5 mb-8">Họ và tên:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.recipient')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Điện thoại:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.phone_number')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.address_1')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ phụ:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.address_2')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Thành phố:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.city')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã vùng:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.state_code')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã bưu điện:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.zipcode')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5">Mã quốc gia:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.country_code')
                            }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Thông tin hàng hóa</div>
                      </div>
                      <div class="card-content">
                        <div class="row">
                          <div class="col-5 mb-8">Chi tiết hàng hóa:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.detail')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã đơn hàng:</div>
                          <div class="col-7">
                            <div>{{
                              $evaluate('package_detail.package.order_number')
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Trọng lượng:</div>
                          <div class="col-7">
                            <div
                              >{{ $evaluate('package_detail.package.weight')
                              }}<span v-if="isOverThanOld('weight')">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_weight'
                                  )
                                }})
                              </span></div
                            >
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Dài:</div>
                          <div class="col-7">
                            <div
                              >{{ $evaluate('package_detail.package.length')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_length'
                                  )
                                }})
                              </span></div
                            >
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Rộng:</div>
                          <div class="col-7">
                            <div
                              >{{ $evaluate('package_detail.package.width')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_width'
                                  )
                                }})
                              </span></div
                            >
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Cao:</div>
                          <div class="col-7">
                            <div
                              >{{ $evaluate('package_detail.package.height')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_height'
                                  )
                                }})
                              </span></div
                            >
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Hàng có pin:</div>
                          <div class="col-7">
                            {{
                              package_detail.package.include_battery
                                ? 'Có'
                                : 'Không'
                            }}
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Tên gói hàng:</div>
                          <div class="col-7">
                            {{
                              $evaluate('package_detail.package.package_name')
                            }}
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Số lượng:</div>
                          <div class="col-7">
                            {{
                              $evaluate(
                                'package_detail.package.package_quantity'
                              )
                            }}
                          </div>
                        </div>
                        <div
                          class="row"
                          v-if="package_detail.package.service.code === 'CN'"
                        >
                          <div class="col-5 mb-8">Mã vạch CN:</div>
                          <div class="col-7">
                            {{ package_detail.package.custom_cn_barcode }}
                          </div>
                        </div>
                        <div
                          class="row"
                          v-if="package_detail.package.service.code === 'CN'"
                        >
                          <div class="col-5 mb-8">Link mua hàng:</div>
                          <div class="col-7">
                            {{
                              package_detail.package.cn_product_link || 'N/A'
                            }}
                          </div>
                        </div>
                        <div
                          class="row"
                          v-if="package_detail.package.service.code === 'CN'"
                        >
                          <div class="col-5 mb-8">Ảnh biên nhận:</div>
                          <a
                            class="col-7 text-blue-500 underline cursor-pointer"
                            href="javascript:void(0);"
                            @click="viewImage"
                          >
                            Xem ảnh
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-24">
                  <div class="col">
                    <div class="card-block mb-0">
                      <div class="card-header">
                        <div class="card-title">Trạng thái</div>
                      </div>
                      <div class="card-content">
                        <div class="mb-16">
                          <div class="row">
                            <div class="col-5 mb-8">Trạng thái đơn:</div>
                            <div class="col-7">
                              <span
                                v-if="
                                  package_detail.package.status &&
                                  package_detail.package.status > 0
                                "
                                v-status="package_detail.package.status"
                              ></span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-5 mb-8">Trạng thái kho:</div>
                            <div class="col-7">
                              <span
                                v-if="
                                  package_detail.package.status &&
                                  package_detail.package.status > 0
                                "
                                v-status="package_detail.package.status"
                                type="warehouse"
                              ></span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-5">Trạng thái khiếu nại:</div>
                            <div class="col-7">
                              <div v-if="package_detail.status_ticket">
                                Có
                              </div>
                              <div v-if="!package_detail.status_ticket">
                                Không
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card-block mb-0">
                      <div class="card-header">
                        <div class="card-title">Hàng return</div>
                      </div>
                      <div
                        class="card-content"
                        v-if="
                          package_detail.package.package_return ||
                          package_detail.package.returned_at
                        "
                      >
                        <div class="mb-16">
                          <div class="row mb-8">
                            <div class="col-4 pr-0">Ngày trả hàng:</div>
                            <div class="col-8 pl-0">
                              <div v-if="package_detail.package.returned_at">
                                {{
                                  package_detail.package.returned_at
                                    | datetime('dd/MM/yyyy')
                                }}</div
                              >
                              <span v-else>N/A</span>
                            </div>
                          </div>
                          <div
                            class="row mb-8"
                            v-if="package_detail.package.package_return"
                          >
                            <div class="col-4 pr-0">Lý do trả hàng:</div>
                            <div class="col-8 pl-0">
                              <div>{{
                                package_detail.package.package_return.reason
                              }}</div>
                            </div>
                          </div>
                          <div
                            class="row mb-16"
                            v-if="package_detail.package.package_return"
                          >
                            <div class="col-4 pr-0">Nguyên nhân:</div>
                            <div class="col-8 pl-0">
                              <div>{{
                                package_detail.package.package_return.content
                              }}</div>
                            </div>
                          </div>
                          <div
                            class="row"
                            v-if="package_detail.package.package_return"
                          >
                            <div class="col-12">
                              <p style="margin-bottom: 8px"
                                ><strong>Bằng chứng:</strong></p
                              >
                              <p
                                style="margin-bottom: 4px"
                                v-for="item in package_detail.package
                                  .package_return.images"
                                :key="item.uid"
                              >
                                <a
                                  style="
                                    text-decoration: underline;
                                    color: #004e41;
                                  "
                                  href="javascript:void(0)"
                                  @click="downloadReturnFile(item)"
                                  >{{
                                    item.substring(item.lastIndexOf('/') + 1)
                                  }}</a
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-content text-center" v-else>
                        <img src="@assets/img/no_data.png" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row fee">
                  <div class="col-6">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Phí phát sinh</div>
                      </div>
                      <div
                        class="card-content"
                        v-if="
                          mapExtraFee.length ||
                          package_detail.package.status == 1
                        "
                      >
                        <div
                          class="row"
                          v-for="(item, i) in mapExtraFee"
                          :key="i"
                        >
                          <div class="col-8 mb-8"
                            >{{ item.extra_fee_types.name }} :</div
                          >
                          <div
                            v-if="package_detail.package.service.code == 'CN'"
                            class="col-4 text-right"
                          >
                            <div>{{ item.amount | formatPriceCN }}</div>
                          </div>
                          <div v-else class="col-4 text-right">
                            <div>{{ item.amount | formatPrice }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="card-content text-center" v-else>
                        <img src="@assets/img/no_data.png" />
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Phí</div>
                      </div>
                      <div class="card-content">
                        <div class="row">
                          <div class="col-8 mb-8">Phí giao hàng:</div>
                          <div class="col-4 text-right">
                            <div
                              v-if="package_detail.package.service.code == 'CN'"
                              >{{
                                $evaluate(
                                  'package_detail.package?.shipping_fee'
                                ) | formatPriceCN
                              }}</div
                            >
                            <div v-else>{{
                              $evaluate('package_detail.package?.shipping_fee')
                                | formatPrice
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-8 mb-8">Phí phát sinh:</div>
                          <div class="col-4 more-extra-fee text-right">
                            <div
                              v-if="package_detail.package.service.code == 'CN'"
                              >{{ sumExtraFee | formatPriceCN }}</div
                            >
                            <div v-else>{{ sumExtraFee | formatPrice }}</div>
                          </div>
                        </div>
                        <hr
                          style="
                            background-color: #e1e2e2;
                            margin-top: 16px;
                            margin-bottom: 12px;
                          "
                        />
                        <div class="row sum-price">
                          <div class="col-8" style="font-weight: 400"
                            >Tổng cước:</div
                          >
                          <div class="col-4 text-right">
                            <div
                              v-if="package_detail.package.service.code == 'CN'"
                              >{{ sumFee | formatPriceCN }}</div
                            >
                            <div v-else>{{ sumFee | formatPrice }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="card-block product-info mb-0">
                    <div class="card-header">
                      <div class="card-title">Thông tin sản phẩm</div>
                    </div>
                    <div
                      class="card-content"
                      :class="{
                        'text-center': !(
                          package_detail.package.package_products &&
                          package_detail.package.package_products.length
                        ),
                      }"
                    >
                      <template
                        v-if="
                          package_detail.package.package_products &&
                          package_detail.package.package_products.length
                        "
                      >
                        <div class="row product-title">
                          <div class="col-5 mb-8">SKU</div>
                          <div class="col-5">Tên sản phẩm</div>
                          <div class="col-2 mb-8 product-quantity"
                            >Số lượng</div
                          >
                        </div>
                        <div
                          class="row product-item"
                          v-for="(prod, index) in package_detail.package
                            .package_products"
                          :key="index"
                        >
                          <div class="col-5 mb-8">{{
                            mapProduct(prod.product_id).sku
                          }}</div>
                          <div class="col-5">{{
                            mapProduct(prod.product_id).name
                          }}</div>
                          <div class="col-2 mb-8 product-quantity">{{
                            prod.quantity
                          }}</div>
                        </div>
                      </template>
                      <template v-else>
                        <img src="@assets/img/no_data.png" />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!displayDeliverDetail"
                class="col-6 logs"
                style="padding: 0 30px 0 30px"
              >
                <div class="row" style="height: 100%">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Hành trình đơn</div>
                        <div class="card-action ml-24">
                          <a href="#" @click="changeDisplayDeliverDetail()"
                            >Lịch sử đơn</a
                          >
                        </div>
                      </div>
                      <div
                        class="card-content deliver-log"
                        :class="{ 'middle-item': !displayDeliverLogs.length }"
                        style="min-height: 50%"
                      >
                        <template v-if="displayDeliverLogs.length">
                          <div class="timeline-new">
                            <div
                              v-for="(item, i) in displayDeliverLogs"
                              :key="i"
                              :class="{
                                'first-item':
                                  i === 0 &&
                                  timelinePagination.currentPage === 1,
                              }"
                              class="timeline-item-new"
                            >
                              <div class="item__right">
                                <div class="title">{{ item.name }}</div>
                              </div>
                              <div
                                v-for="(it, j) in item.data"
                                :key="j"
                                class="item__right__data"
                                :class="{
                                  'first-data': j === 0,
                                }"
                              >
                                <div class="time col-2 pl-0">
                                  {{ it.ship_time | datetime('HH:mm:ss') }}</div
                                >
                                <div class="des col-10 pl-0">
                                  <span v-html="it.text"></span>
                                  <span class="location" v-if="it.location">
                                    ___{{ it.location }}</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="timeline__next-page">
                            <div
                              :class="{
                                'disable-next-page':
                                  timelinePagination.currentPage <= 1,
                              }"
                              @click="previousTimeLinePage"
                              >Trước</div
                            >
                            <div
                              :class="{
                                'disable-next-page':
                                  timelinePagination.currentPage >=
                                    timelinePagination.numberPage ||
                                  timelinePagination.numberPage <= 1,
                              }"
                              @click="nextTimeLinePage"
                              >Sau</div
                            >
                          </div>
                        </template>
                        <template v-else>
                          <img src="@assets/img/no_data.png" />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="displayDeliverDetail"
                class="col-6 logs"
                style="padding: 0 30px 0 30px"
              >
                <div class="row" style="height: 100%">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-action"
                          ><a @click="changeDisplayDeliverDetail()" href="#"
                            >Hành trình đơn</a
                          >
                        </div>

                        <div class="card-title ml-24">Lịch sử đơn</div>
                      </div>
                      <div
                        class="card-content"
                        :class="{ 'middle-item': !displayAuditLogs.length }"
                        style="min-height: 50%"
                      >
                        <template v-if="displayAuditLogs.length">
                          <div class="table-responsive">
                            <table class="table table-hover" id="tbl-packages">
                              <thead>
                                <tr>
                                  <th>Thời gian</th>
                                  <th>Người thực hiện</th>
                                  <th>Loại thay đổi</th>
                                  <th>Nội dung cũ</th>
                                  <th>Nội dung mới</th>
                                  <th>Phí phát sinh</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(item, i) in displayAuditLogs"
                                  :key="i"
                                >
                                  <td>
                                    {{
                                      item.created_at
                                        | datetime('dd/MM/yyyy - HH:mm')
                                    }}
                                  </td>
                                  <td>{{ item.updated_user_name }}</td>
                                  <td>
                                    {{
                                      $evaluate(
                                        `changePackageType[${item.type}]`
                                      ) || ''
                                    }}
                                  </td>
                                  <td>
                                    <p-tooltip
                                      :label="item.old_value"
                                      size="large"
                                      position="top"
                                      type="dark"
                                      :active="item.old_value.length > 15"
                                    >
                                      {{ truncate(item.old_value, 15) }}
                                    </p-tooltip>
                                  </td>
                                  <td>
                                    <p-tooltip
                                      :label="item.value"
                                      size="large"
                                      position="top"
                                      type="dark"
                                      :active="item.value.length > 15"
                                    >
                                      {{ truncate(item.value, 15) }}
                                    </p-tooltip>
                                  </td>
                                  <td style="text-align: right">{{
                                    item.fee | formatPrice
                                  }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="timeline__next-page">
                            <div
                              :class="{
                                'disable-next-page':
                                  auditPagination.currentPage <= 1,
                              }"
                              @click="previousAuditLogPage"
                              >Trước</div
                            >
                            <div
                              :class="{
                                'disable-next-page':
                                  auditPagination.currentPage >=
                                    auditPagination.numberPage ||
                                  auditPagination.numberPage <= 1,
                              }"
                              @click="nextAuditLogPage"
                              >Sau</div
                            >
                          </div>
                        </template>
                        <template v-else>
                          <img src="@assets/img/no_data.png" />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-edit-order
      :is-re-label="isReLabel"
      :visible.sync="isVisibleModal"
      @submit="handleUpdate"
      :total="sumFee"
    >
    </modal-edit-order>
    <modal-confirm
      :visible.sync="isVisibleConfirmWayBill"
      v-if="isVisibleConfirmWayBill"
      :actionConfirm="actions.wayBill.button"
      :description="actions.wayBill.Description"
      :title="actions.wayBill.title"
      :type="actions.wayBill.type"
      :disabled="actions.wayBill.disabled"
      :loading="actions.wayBill.loading"
      @action="handleActionWayBill"
    ></modal-confirm>

    <modal-confirm
      :visible.sync="visibleConfirmCancel"
      v-if="visibleConfirmCancel"
      :actionConfirm="actions.cancelPackage.button"
      :cancel="actions.cancelPackage.cancel"
      :description="actions.cancelPackage.Description"
      :title="actions.cancelPackage.title"
      :type="actions.cancelPackage.type"
      :disabled="actions.cancelPackage.disabled"
      :loading="actions.cancelPackage.loading"
      @action="cancelPackageAction"
    ></modal-confirm>
    <modal-create-extra-fee
      :visible.sync="isVisibleModalExtraFee"
      :package-code="$evaluate('package_detail.package.package_code?.code')"
      :loading="isSubmitting"
      @save="handleSubmitExtraFee"
    ></modal-create-extra-fee>
    <modal-create-tracking
      @save="handleCreateTracking"
      :visible.sync="isVisisbleModalCreateTracking"
    ></modal-create-tracking>
    <OverLoading :is-loading="isSubmitting" />
  </div>
</template>

<style scoped>
.sum-price:last-child {
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  color: #313232;
}

.disable-extra-fee {
  color: #cfd0d0;
}

.bold-line {
  font-weight: 600;
}

.through-line,
.through-line td {
  text-decoration-line: line-through;
  color: #aaabab !important;
}
</style>
<script>
import { print } from '@core/utils/print'
import { mapActions, mapState } from 'vuex'

import {
  CHANGE_PACKAGE_TYPE,
  DELIVER_LOG_PACKAGE,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
  PACKAGE_CODE_TEMP,
  PACKAGE_STATUS_ARCHIVED,
  PACKAGE_STATUS_CANCELLED,
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_DELIVERED,
  PACKAGE_STATUS_EXPIRED,
  PACKAGE_STATUS_IMPORT_HUB,
  PACKAGE_STATUS_IN_TRANSIT,
  PACKAGE_STATUS_RESHIP,
  PACKAGE_STATUS_RETURNED,
  PACKAGE_STATUS_TAB,
  PACKAGE_STATUS_UNDELIVERED,
  PACKAGE_STATUS_WAREHOUSE_EXPORT,
  PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER,
  PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT,
} from '@/packages/package/constants'
import mixinChaining from '@/packages/shared/mixins/chaining'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import OverLoading from '@components/shared/OverLoading'
import { ROLE_SALE, ROLE_SUPPORT } from '@core/constants'
import Browser from '@core/helpers/browser'
import mixinTable from '@core/mixins/table'
import { cloneDeep } from '@core/utils'
import { truncate } from '@core/utils/string'
import { extension } from '@core/utils/url'
import Uniq from 'lodash/uniq'
import { datetime } from '../../../core/utils/datetime'
import { CREATE_EXTRA_FEE } from '../../bill/store/index'
import api from '../api'
import ModalCreateExtraFee from '../components/ModalCreateExtraFee'
import ModalCreateTracking from '../components/ModalCreateTracking'
import ModalEditOrder from '../components/ModalEditOrder'
import TrackLink from '../components/TrackLink.vue'
import {
  CANCEL_PACKAGES,
  CREATE_EVENT_TRACKING,
  FETCH_LIST_PRODUCTS,
  FETCH_LIST_SERVICE,
  FETCH_PACKAGE_DETAIL,
  RESHIP_PACKAGE,
  UPDATE_PACKAGE,
} from '../store/index'

export default {
  name: 'PackageDetail',
  mixins: [mixinChaining, mixinTable],
  components: {
    ModalEditOrder,
    ModalCreateTracking,
    ModalConfirm,
    ModalCreateExtraFee,
    OverLoading,
    TrackLink,
  },
  data() {
    return {
      isFetching: true,
      isSubmitting: false,
      packageID: 0,
      displayDeliverDetail: false,
      isVisibleModal: false,
      isVisiblePopupMoreExtraFee: false,
      isVisibleConfirmWayBill: false,
      isReLabel: false,
      isVisibleModalExtraFee: false,
      isVisisbleModalCreateTracking: false,
      timelinePagination: {
        numberPage: 0,
        itemsPerPage: 10,
        currentPage: 1,
      },
      auditPagination: {
        numberPage: 0,
        itemsPerPage: 10,
        currentPage: 1,
      },
      actions: {
        wayBill: {
          type: 'primary',
          title: 'Xác nhận vận đơn',
          button: 'Vận đơn',
          Description: '',
          disabled: false,
          loading: false,
        },
        cancelPackage: {
          type: 'primary',
          title: 'Xác nhận hủy đơn',
          button: 'Hủy đơn',
          cancel: 'Bỏ qua',
          Description: '',
          disabled: false,
          loading: false,
        },
      },
      visibleConfirmCancel: false,
      isVisibleModalLabel: false,
      blob: null,
      roleSupport: ROLE_SUPPORT,
      roleSale: ROLE_SALE,
    }
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
      products: (state) => state.products,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    showBtnCreateTracking() {
      return (
        this.package_detail.package.status != PACKAGE_STATUS_CREATED &&
        (this.$isAdmin() || this.$isBusinessManager())
      )
    },
    showBtnCnPurchased() {
      return (
        this.package_detail.package.status === 3 &&
        this.package_detail.package.service.code === 'CN'
      )
    },
    showBtnCnPrePurchased() {
      return (
        this.package_detail.package.status === 1 &&
        this.package_detail.package.service.code === 'CN'
      )
    },
    showButtonEdit() {
      const { status } = (this.package_detail || {}).package || {}
      if (!status) return false

      const listStatus = [
        PACKAGE_STATUS_CANCELLED,
        PACKAGE_STATUS_ARCHIVED,
        PACKAGE_STATUS_DELIVERED,
        PACKAGE_STATUS_IN_TRANSIT,
        PACKAGE_STATUS_EXPIRED,
        PACKAGE_STATUS_UNDELIVERED,
        PACKAGE_STATUS_RESHIP,
        PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER,
        PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT,
        PACKAGE_STATUS_WAREHOUSE_EXPORT,
      ]
      return (
        (this.$isSupport() ||
          this.$isAdmin() ||
          this.$isSupportLeader() ||
          this.$isBusinessManager() ||
          this.$isSaleOperation() ||
          this.$isSale()) &&
        (listStatus.includes(status) == false || this.isReturnPackage)
      )
    },
    displayDeliverLogs() {
      const start =
        (this.timelinePagination.currentPage - 1) *
        this.timelinePagination.itemsPerPage

      let logs = this.package_detail.deliver_logs
        .slice(start, start + this.timelinePagination.itemsPerPage)
        .filter((log) => {
          return log.type !== PACKAGE_STATUS_CREATED
        })
        .map((log) => {
          let text = log.description
          switch (log.type) {
            case PACKAGE_STATUS_RETURNED:
              text = `${DELIVER_LOG_PACKAGE[log.type]} <p>Lí do: ${
                log.description
              }</p>`
              break
            default:
              text = log.description || DELIVER_LOG_PACKAGE[log.type]
          }
          return { ship_time: log.ship_time, text, location: log.location }
        })

      const times = logs.map((item) => datetime(item.ship_time, 'dd-MM-yyyy'))
      let ConvertData = []
      const uniqTimes = Uniq(times)
      uniqTimes.forEach((element) =>
        ConvertData.push({ name: element, data: [] })
      )
      ConvertData.forEach((x) =>
        logs.forEach(function (it) {
          if (datetime(it.ship_time, 'dd-MM-yyyy') == x.name) {
            x.data.push(it)
          }
        })
      )
      return ConvertData
    },
    displayAuditLogs() {
      const start =
        (this.auditPagination.currentPage - 1) *
        this.auditPagination.itemsPerPage
      return this.package_detail.audit_logs.slice(
        start,
        start + this.auditPagination.itemsPerPage
      )
    },
    sumExtraFee() {
      let amount = 0
      if (
        this.package_detail.package.status == PACKAGE_STATUS_CREATED &&
        !this.isPkgExceedNotEstimate
      ) {
        amount += this.calculateFee(this.package_detail.package.weight)
      }

      if (
        !this.package_detail.extra_fee ||
        this.package_detail.extra_fee.length <= 0
      ) {
        return amount
      }

      amount += this.package_detail.extra_fee.reduce(
        (total, item) => total + item.amount,
        0
      )

      return amount
    },
    sumFee() {
      return this.package_detail.package.shipping_fee + this.sumExtraFee
    },
    isImage() {
      const ext = extension(this.package_detail.package.label)
      return ['png', 'jpg', 'jpeg'].includes(ext)
    },
    extraFee() {
      return this.package_detail.extra_fee ? this.package_detail.extra_fee : []
    },
    statusCreated() {
      return PACKAGE_STATUS_CREATED
    },
    statusArchived() {
      return PACKAGE_STATUS_ARCHIVED
    },
    packageStatus() {
      return PACKAGE_STATUS_TAB
    },
    changePackageType() {
      return CHANGE_PACKAGE_TYPE
    },
    statusCancel() {
      return PACKAGE_STATUS_CANCELLED
    },
    statusSuccess() {
      return PACKAGE_STATUS_DELIVERED
    },
    statusExpired() {
      return PACKAGE_STATUS_EXPIRED
    },
    statusShipping() {
      return PACKAGE_STATUS_IN_TRANSIT
    },
    statusImportHub() {
      return PACKAGE_STATUS_IMPORT_HUB
    },
    mapExtraFee() {
      const arr = cloneDeep(this.extraFee),
        result = []

      if (
        this.package_detail.package.status == PACKAGE_STATUS_CREATED &&
        !this.isPkgExceedNotEstimate
      ) {
        result.push({
          extra_fee_types: { name: 'Peak season surcharge' },
          amount: this.calculateFee(this.package_detail.package.weight),
        })
      }

      for (const ele of arr) {
        let index = result.findIndex(
          (x) => x.extra_fee_types.name == ele.extra_fee_types.name
        )

        if (index == -1) {
          result.push(ele)
        } else {
          result[index].amount += ele.amount
        }
      }

      return result
    },
    isReturnPackage() {
      return this.package_detail.package.alert === PACKAGE_ALERT_TYPE_HUB_RETURN
    },
    isHasCancel() {
      const status = ((this.package_detail || {}).package || {}).status
      if (!status) return false

      return (
        (this.$isAdmin() ||
          this.$isSupport() ||
          this.$isSale() ||
          this.$isSupportLeader() ||
          this.$isBusinessManager()) &&
        [
          PACKAGE_STATUS_CANCELLED,
          PACKAGE_STATUS_ARCHIVED,
          PACKAGE_STATUS_DELIVERED,
          PACKAGE_STATUS_IN_TRANSIT,
          PACKAGE_STATUS_EXPIRED,
          PACKAGE_STATUS_IMPORT_HUB,
        ].includes(status) == false
      )
    },
    isPkgExceedNotEstimate() {
      return (
        this.package_detail.package.is_package_exceed &&
        this.package_detail.package.shipping_fee == 0
      )
    },
  },
  created() {
    this.packageID = parseInt(this.$route.params.id, 10)
  },
  mounted() {
    this.init()
  },
  filters: {
    toDay(val) {
      if (!val) return 'N/A'

      const day = Math.round(val / 86400)
      return `${day} ngày`
    },
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PRODUCTS,
      FETCH_PACKAGE_DETAIL,
      FETCH_LIST_SERVICE,
      CANCEL_PACKAGES,
      RESHIP_PACKAGE,
      UPDATE_PACKAGE,
      CREATE_EVENT_TRACKING,
    ]),
    ...mapActions('bill', [CREATE_EXTRA_FEE]),
    truncate,
    async init() {
      this.isFetching = true
      await this.fetchPackage(this.packageID)
      await this[FETCH_LIST_SERVICE]()
      const payload = {
        user_id: this.package_detail.package.user_id,
      }
      await this[FETCH_LIST_PRODUCTS](payload)
      this.isFetching = false
    },
    showPackageCode(item) {
      if (item.status === PACKAGE_STATUS_ARCHIVED) {
        return false
      }
      return item.package_code
        ? item.package_code.status !== PACKAGE_CODE_TEMP
        : false
    },
    init2() {
      location.reload()
    },
    async init3() {
      try {
        let res = await api.fetchPackage(this.package_detail.package.id)
        if (res && res.package) {
          this.package_detail = res
        }
      } catch (error) {
        console.error('Lỗi khi load dữ liệu:', error)
      }
    },
    async downloadReturnFile(file) {
      const res = await api.fetchFile({
        url: file,
        type: 'return_packages',
      })
      if (res && !res.error) {
        Browser.downloadBlob(res, file.split('/').pop())
      }
    },
    async handleCreateTracking(data) {
      this.isSubmitting = true
      data.package_id = this.packageID
      const res = await this[CREATE_EVENT_TRACKING](data)
      this.isSubmitting = false
      if (!res || res.error) {
        return this.$toast.open({
          type: 'error',
          message: res.message,
          duration: 3000,
        })
      }
      this.isVisisbleModalCreateTracking = false
      this.$toast.open({
        type: 'success',
        message: 'Tạo lịch sử tracking thành công',
        duration: 3000,
      })
      this.init()
    },
    async downloadLabelFile() {
      try {
        const url = this.package_detail.package.label
        if (!url) {
          throw new Error('File URL is missing')
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
          window.open(url, '_blank')
        } else {
          const res = await api.fetchFile({ url: url, type: 'labels' })
          if (res instanceof Blob) {
            Browser.downloadBlob(res, url.split('/').pop())
          } else {
            throw new Error('Invalid file response')
          }
        }
      } catch (error) {
        console.error('Error downloading label file:', error)
        this.$toast.error('Có lỗi xảy ra khi tải file!')
      }
    },
    async createLabel() {
      if (!this.package_detail.package.custom_cn_barcode) {
        return this.$toast.open({
          type: 'error',
          message:
            'Đơn hàng CN Exclusive cần bổ sung mã vạch tự tạo, hãy cập nhật thông tin đơn hàng',
          duration: 3000,
        })
      }
      const payload = {
        id: this.package_detail.package.id,
      }
      this.isSubmitting = true
      const res = await api.processPackageCn(payload)
      this.isSubmitting = false
      if (!res || res.error) {
        return this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
      }
      this.$toast.open({
        type: 'success',
        message: 'Tạo lịch sử tracking thành công',
        duration: 3000,
      })
      this.init()
    },
    changeDisplayDeliverDetail() {
      this.displayDeliverDetail = !this.displayDeliverDetail
    },
    handleModal() {
      this.isVisibleModal = true
      if (this.isReturnPackage) {
        this.isReLabel = true
      }
    },
    previousTimeLinePage() {
      this.timelinePagination.currentPage <= 1
        ? (this.timelinePagination.currentPage = 1)
        : (this.timelinePagination.currentPage -= 1)
    },
    nextTimeLinePage() {
      this.timelinePagination.currentPage =
        this.timelinePagination.currentPage >=
        this.timelinePagination.numberPage
          ? this.timelinePagination.numberPage
          : this.timelinePagination.currentPage + 1
    },
    previousAuditLogPage() {
      this.auditPagination.currentPage <= 1
        ? (this.auditPagination.currentPage = 1)
        : (this.auditPagination.currentPage -= 1)
    },
    nextAuditLogPage() {
      this.auditPagination.currentPage =
        this.auditPagination.currentPage >= this.auditPagination.numberPage
          ? this.auditPagination.numberPage
          : this.auditPagination.currentPage + 1
    },
    showPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = true
    },
    hiddenPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = false
    },

    handleCancelPackage() {
      this.actions.cancelPackage.Description = `Bạn có chắc chắn muốn hủy đơn?`
      this.visibleConfirmCancel = true
    },
    showModalCreateTracking() {
      this.isVisisbleModalCreateTracking = true
    },
    async handlePurchased() {
      if (this.isSubmitting) return
      this.isSubmitting = true

      if (!this.package_detail || !this.package_detail.package) {
        this.isSubmitting = false
        return
      }

      const oldStatus = this.package_detail.package.status
      this.package_detail.package.status = 3

      try {
        const updateData = {
          ...this.package_detail.package,
          id: this.package_detail.package.id,
          status: 3,
          recipient: this.package_detail.package.recipient,
          weight: +this.package_detail.package.weight,
          width: +this.package_detail.package.width,
          length: +this.package_detail.package.length,
          height: +this.package_detail.package.height,
          service: this.package_detail.package.service.name,
          address_1: this.package_detail.package.address_1,
          country_code: this.package_detail.package.country_code,
          city: this.package_detail.package.city,
          state_code: this.package_detail.package.state_code,
          zipcode: this.package_detail.package.zipcode,
          detail: this.package_detail.package.detail,
          sku: this.package_detail.package.order_number,
        }

        let result = await this[UPDATE_PACKAGE](updateData)
        if (result.error) {
          console.error('❌ API báo lỗi:', result.message)
          this.$toast.error(result.message, { duration: 3000 })
          this.package_detail.package.status = oldStatus
          this.isSubmitting = false
          return
        }

        this.isVisibleModalCreateTracking = true
        this.$toast.success('✅ Cập nhật trạng thái thành công!', {
          duration: 3000,
        })

        await this.init3()
      } catch (error) {
        this.$toast.error('⚠ Có lỗi xảy ra, vui lòng thử lại!', {
          duration: 3000,
        })

        this.package_detail.package.status = oldStatus
      } finally {
        this.isSubmitting = false
      }
    },
    async cancelPackageAction() {
      if (
        this.package_detail.package.status ==
          PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER ||
        this.package_detail.package.status ==
          PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT
      ) {
        this.visibleConfirmCancel = false
        return this.$toast.open({
          type: 'error',
          message: 'Đơn hàng không thể hủy vì đang nằm trong kiện',
          duration: 3000,
        })
      }
      let id = this.packageID

      let payload = {
        ids: [id],
      }

      this.actions.cancelPackage.loading = true
      const result = await this[CANCEL_PACKAGES](payload)
      this.visibleConfirmCancel = false
      this.actions.cancelPackage.loading = false
      if (!result || !result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      this.init()
      this.$toast.open({
        type: 'success',
        message: 'Hủy đơn thành công',
        duration: 3000,
      })
    },

    async showContent() {
      document.activeElement && document.activeElement.blur()

      try {
        print(this.package_detail.package.label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    async viewImage() {
      const data = await api.getCNInvoiceImage(
        this.package_detail.package.cn_invoice_image
      )
      try {
        Browser.downloadBlob(
          data,
          `Image ${this.package_detail.package.order_number}`
        )
      } catch (error) {
        this.$toast.open({ type: 'error', message: 'File error !!!' })
      }
    },
    isOverThanOld(prop) {
      if (!this.package_detail.package) {
        return false
      }

      if (prop == 'weight') {
        return (
          this.package_detail.package.actual_weight >
          this.package_detail.package[prop]
        )
      }
      return (
        this.package_detail.package.actual_height *
          this.package_detail.package.actual_width *
          this.package_detail.package.actual_length >
        this.package_detail.package.height *
          this.package_detail.package.width *
          this.package_detail.package.length
      )
    },

    showModalExtraFee() {
      this.isVisibleModalExtraFee = true
    },
    async handleSubmitExtraFee(param) {
      const payload = {
        ...param,
        ...{
          package_code: [this.package_detail.package.package_code.code],
          user_id: [this.package_detail.package.user_id],
        },
      }
      this.isSubmitting = true
      const result = await this[CREATE_EXTRA_FEE](payload)
      this.isSubmitting = false
      this.isVisibleModalExtraFee = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Tạo phí phát sinh thành công',
      })
      this.init()
    },

    async handleUpdate(params) {
      if (this.isSubmitting) return

      this.isSubmitting = true

      let result = await this[UPDATE_PACKAGE](params)
      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        this.isSubmitting = false
        return
      }

      this.isVisibleModal = false
      this.$toast.success('Sửa đơn hàng thành công', { duration: 3000 })
      await this.init2()
    },
    mapProduct(productID) {
      return this.products.find((prod) => prod.id == productID)
    },
  },

  watch: {
    package_detail: {
      handler: function (val) {
        if (val.deliver_logs && val.deliver_logs.length > 0) {
          this.timelinePagination.numberPage = Math.ceil(
            val.deliver_logs.length / this.timelinePagination.itemsPerPage
          )
        }
        if (val.audit_logs && val.audit_logs.length > 0) {
          this.auditPagination.numberPage = Math.ceil(
            val.audit_logs.length / this.auditPagination.itemsPerPage
          )
        }
      },
      deep: true,
    },
  },
}
</script>
