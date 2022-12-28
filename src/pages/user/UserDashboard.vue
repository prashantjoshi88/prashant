<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.user.title }}</h3>
    </div>

    <div class="q-pa-md main-wrapper">
      <div class="bg-box bg-res">
        <div class="row q-col-gutter-xl flex-direction">
          <div class="col-md-3">
            <div class="sub-box sub-box-total">
              <div class="sub-img-total sub-img">
                <img src="~assets/images/totaluser.svg" alt="" />
              </div>
              <div class="sub-box-text q-mt-md q-pl-md">
                <h5 class="title">{{ counter.total_users }}</h5>
                <p>{{ $q.lang.user.users_count.total_users }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="sub-box sub-box-active">
              <div class="sub-img-active sub-img">
                <img src="~assets/images/activeuser.svg" alt="" />
              </div>
              <div class="sub-box-text q-mt-md q-pl-md">
                <h5 class="title">{{ counter.active_users }}</h5>
                <p>{{ $q.lang.user.users_count.active_users }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="sub-box sub-box-block">
              <div class="sub-img-block sub-img">
                <img src="~assets/images/blockuser.svg" alt="" />
              </div>
              <div class="sub-box-text q-mt-md q-pl-md">
                <h5 class="title">{{ counter.blocked_users }}</h5>
                <p>{{ $q.lang.user.users_count.blocked_users }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="sub-box sub-box-online">
              <div class="sub-img-online sub-img">
                <img src="~assets/images/onlineuser.svg" alt="" />
              </div>
              <div class="sub-box-text q-mt-md q-pl-md">
                <h5 class="title">{{ counter.online_users }}</h5>
                <p>{{ $q.lang.user.users_count.online_users }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <q-card flat bordered class="filter-card q-my-lg">
        <q-card-section>
          <q-separator inset class="q-my-lg" />
          <div class="row">
            <div class="filter-field q-ml-md q-mb-sm">
              <h5 class="title q-ml-md">{{ $q.lang.user.filter.title }}</h5>
            </div>
            <div class="col-md-8 col-12">
              <div class="filter-field q-ml-md q-mb-sm">
                <div class="hr-form q-ml-lg">
                  <label class="q-mr-sm">{{
                    $q.lang.user.filter.role_label
                  }}</label>
                  <q-select
                    outlined
                    v-model="userGroup"
                    :options="groupOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="status-checkbox">
                <label>{{
                  $q.lang.user.filter.status_checkbox.status_label
                }}</label>
                <div class="q-gutter-sm">
                  <q-checkbox
                    v-model="status"
                    val="100"
                    :label="$q.lang.user.filter.status_checkbox.active_label"
                  />
                  <q-checkbox
                    v-model="status"
                    val="0"
                    :label="$q.lang.user.filter.status_checkbox.inactive_label"
                  />
                  <q-checkbox
                    v-model="status"
                    val="200"
                    :label="$q.lang.user.filter.status_checkbox.lock_label"
                  />
                </div>
                <div class="col-md-2 q-ml-md">
                  <q-btn color="primary" @click="applyFilter">{{
                    $q.lang.user.filter.button
                  }}</q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card> -->

      <div class="custom-tabel-box">
        <table-component
          ref="userTableComponent"
          :apiUrl="USER.LIST"
          :columns="columns"
          rowKey="id"
          :title="$q.lang.user.table_title"
          createUrl="user/create"
          toggle="user"
          @delete="deleteItem"
          @edit="editItem"
          @view="showItem"
          @lock="lockUser"
          :extra-filter="{
            accountStatus: status,
            group: userGroup,
          }"
        >
          <template v-slot:filter>
            <q-checkbox
              v-model="status"
              val="100"
              :label="$q.lang.user.filter.status_checkbox.active_label"
              @click="applyFilter"
            />
            <q-checkbox
              v-model="status"
              val="0"
              :label="$q.lang.user.filter.status_checkbox.inactive_label"
              @click="applyFilter"
            />
            <q-checkbox
              v-model="status"
              val="200"
              :label="$q.lang.user.filter.status_checkbox.lock_label"
              @click="applyFilter"
            />

            <!-- <q-btn color="primary" @click="applyFilter">{{
              $q.lang.user.filter.button
            }}</q-btn> -->
          </template>
        </table-component>
      </div>
    </div>
  </div>
  <q-dialog v-model="showDialog">
    <q-card class="my-card comman-close-popup poli-card-width">
      <div class="close-top-posi">
        <i class="las la-times" v-close-popup></i>
      </div>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ showItemData.name }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none newpolicy-popup">
        <q-item>
          <q-item-section>
            <q-item-label
              ><div class="col text-h6 ellipsis">
                {{ showItemData.email }}
              </div></q-item-label
            >
          </q-item-section>
        </q-item>
        <!-- <q-item>
          <q-badge
            v-if="showItemData.groups.length != 0"
            color="primary"
            text-color="white"
            label="Groups"
          /><br />
          <q-item-section v-for="item in showItemData.groups" :key="item">
            <q-item-label class="policy-listing q-pb-sm">
              <div class="poli-label">{{ item.name }}</div>
            </q-item-label>
          </q-item-section>
        </q-item> -->
        <!-- <q-item>
          <q-badge
            v-if="showItemData.policies.length != 0"
            color="primary"
            text-color="white"
            label="Policies"
          /><br />
          <q-item-section v-for="item in showItemData.policies" :key="item">
            <q-item-label class="policy-listing q-pb-sm">
              <div class="poli-label">
                {{ item.name }}
                <q-item-section
                  v-for="(value, keys) in item.policy"
                  :key="keys"
                >
                  <span v-for="key in Object.keys(value)" :key="key">
                    <q-item-label class="policy-listing q-pb-sm">
                      <q-badge color="blue q-mr-md">
                        <div class="value-text-policy">{{ key }}</div>
                      </q-badge>

                      <div class="poli-label">{{ value[key] }}</div>
                    </q-item-label>
                  </span>
                </q-item-section>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { userStore } from "src/stores/users";
import { USER } from "src/apis/constant";
import { useRouter } from "vue-router";
import notification from "src/boot/notification";

import moment from "moment";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = userStore();

const userTableComponent = ref();

const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

store.fetchUserCounter();
const counter = computed(() => {
  return store.getCounter;
});
const showDialog = ref(false);
const showItemData = ref({});

const columns = [
  {
    name: "id",
    label: "NO.",
    field: "index",
    // //sortable: true,
    align: "left",
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    // //sortable: true,
  },

  {
    name: "email",
    align: "center",
    label: "Email",
    field: (row) => row.email,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "account_Created_date",
    label: "Account Created Date",
    field: (row) => moment(row.created_at).format("MM/DD/YYYY - HH:mm"),
    format: (val) => `${val}`,
    // //sortable: true,
    style: "width: 10px",
  },
  {
    name: "last_logged_in",
    label: "Last Logged In",
    field: (row) =>
      row.last_login ? moment(row.last_login).format("MM-DD-YYYY") : "",
    format: (val) => `${val}`,
  },
  // { name: "password_age", label: "Password Age", field: "protein" },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
  },
];

const status = ref([]);
const userGroup = ref(null);

function applyFilter() {
  userTableComponent.value.refresh();
}
// Emitted from table component
function deleteItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .deleteUser(item.id)
    .then((res) => {
      if (res.success == true) {
        applyFilter().then(() => {
          notification.success(res.message);
        });
        Loading.hide();
      } else if (res.success == false) {
        notification.error(res.message);
        Loading.hide();
      }
    })
    .finally(() => {
      Loading.hide();
    });
}

function editItem(item) {
  router.push({
    name: "edit-user",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchUser(item.id)
    .then((res) => {
      if (res.success == true) {
        showItemData.value = res.data;
        showDialog.value = true;
        Loading.hide();
      } else if (res.success == false) {
        notification.error(res.message);
        Loading.hide();
      }
    })
    .finally(() => {
      Loading.hide();
    });
}
</script>

<style lang="scss">
h3.comman-title {
  font-size: 25px;
  font-weight: bold;
  margin-left: 33px;
  padding-top: 20px;
}

// $

.bg-box {
  background: #ffffff;
  border: $value-1 solid #d7d7d7;
  border-radius: map-get($borderRadius, value12);
  padding: $value-30;

  .sub-box {
    border-radius: map-get($borderRadius, value12);
    width: $percentage-100;
    height: $value-118;
    @include hr-vr-center;

    &.sub-box-total {
      background: rgba(79, 45, 127, 0.2);
      border: $value-1 solid rgba(79, 45, 127, 0.6);
    }

    &.sub-box-active {
      background: rgba(84, 181, 94, 0.2);
      border: $value-1 solid rgba(84, 181, 94, 0.6);
    }

    &.sub-box-block {
      background: rgba(212, 97, 97, 0.2);
      border: $value-1 solid rgba(212, 97, 97, 0.6);
    }

    &.sub-box-online {
      background: rgba(84, 181, 94, 0.2);
      border: $value-1 solid rgba(84, 181, 94, 0.6);
    }

    img {
      width: $value-40;
      height: $value-40;
    }

    h5 {
      font-size: $value-25;
      font-weight: map-get($font-weights, bold);
    }

    .sub-img {
      border-radius: map-get($borderRadius, value10);
      width: $value-56;
      height: $value-56;
      @include hr-vr-center;

      &.sub-img-total {
        background: rgba(79, 45, 127, 0.5);
      }

      &.sub-img-active {
        background: rgba(84, 181, 94, 0.5);
      }

      &.sub-img-block {
        background: rgba(213, 97, 97, 0.5);
      }

      &.sub-img-online {
        background: rgba(161, 225, 138, 0.5);
      }
    }
  }
}

.filter-card {
  background: rgba(79, 45, 127, 0.06);
  border: $value-1 solid rgba(79, 45, 127, 0.31);
  border-radius: map-get($borderRadius, "value15");

  .q-field {
    .q-field__control {
      width: $value-360;
      height: $value-40;
      background: #ffffff;
      border: $value-1 solid #cccccc;
      border-radius: map-get($borderRadius, "value5");
      min-height: $value-40;
    }

    .q-field__marginal {
      height: $value-40;
    }
  }

  .filter-field {
    display: map-get($displays, "flex");

    .hr-form {
      @include box-vr-center;

      label {
        font-size: $value-16;
        font-weight: map-get($font-weights, medium);
      }
    }
  }

  .status-checkbox {
    @include box-vr-center;
    justify-content: flex-end;
    margin-right: $value-13;

    label {
      font-size: $value-16;
      font-weight: map-get($font-weights, medium);
    }
  }
}

.userlist-box {
  .head-sec {
    @include hr-vr-center-between;
  }
}
</style>
