<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.patient.title }}</h3>
    </div>

    <div class="q-pa-md main-wrapper">
      <!-- <q-card flat bordered class="filter-card q-my-lg">
        <q-card-section>
          <div class="row">
            <div class="filter-field q-ml-md q-mb-sm">
              <h5 class="title q-ml-md">{{ $q.lang.user.filter.title }}</h5>
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
          :apiUrl="PATIENT.LIST"
          :columns="columns"
          rowKey="id"
          :title="$q.lang.patient.table_title"
          createUrl="/patient/create"
          toggle="patient"
          :orgId="selectedOrg"
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
            <q-btn-dropdown
              color="primary"
              :label="orgName.label ? orgName.label : 'Organization'"
            >
              <q-list v-for="(item, index) in organizationList" :key="index">
                <q-item clickable v-close-popup @click="selectOrg(item)">
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn v-if="orgName" @click="clearFilter" icon="la la-times" />
          </template>
          <template v-slot:import>
            <q-btn
              color="primary"
              label="Import Patient"
              :to="{ name: 'bulk-import' }"
            />
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
          <div class="col text-h6 ellipsis">Name : {{ showItemData.name }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none newpolicy-popup">
        <q-item>
          <q-item-section>
            <q-item-label
              ><div class="col text-h6 ellipsis">
                Email : {{ showItemData.email }}
              </div></q-item-label
            >
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Patient CR : {{ showItemData.patient_cr }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Phone Number : {{ showItemData.phone_number }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Last logged in : {{ moment(showItemData.last_login).fromNow() }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { patientStore } from "src/stores/patient";
import { PATIENT } from "src/apis/constant";
import { useRouter, useRoute } from "vue-router";
import notification from "src/boot/notification";

import { Loading, QSpinnerGears } from "quasar";

import moment from "moment";

const router = useRouter();
const route = useRoute();
const store = patientStore();

const userTableComponent = ref();

store.fetchOrganization();
const organizationList = computed(() => {
  return store.organizationList;
});

const selectedOrg = ref(route.query.slug);
console.log("---------", selectedOrg.value);
const orgName = ref(
  selectedOrg.value
    ? {
        label: get_org(parseInt(route.query.slug)) ?? "",
        value: route.query.slug,
      }
    : ""
);

function selectOrg(val) {
  console.log(val);
  orgName.value = val;
  applyFilter();
}

function applyFilter() {
  selectedOrg.value = orgName.value.value;
  userTableComponent.value.refresh();
}
function clearFilter() {
  orgName.value = "";
  applyFilter();
}
// console.log(orgName.value.value);

const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);
// const groupOptions = ref([]);
// storeGroup.fetchGroupList().then((res) => {
//   if (res.success == true) {
//     res.data.forEach((item) => {
//       groupOptions.value.push({
//         label: item.name,
//         value: item.id,
//       });
//     });
//   } else {
//     notification.error(res.message);
//   }
// });

function get_org(id) {
  return organizationList.value.find((item) => item.value === id)?.label;
}
console.log(get_org(1));

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
    name: "ph_number",
    align: "center",
    label: "Phone Number",
    field: (row) => row.phone_number,
    format: (val) => `${val}`,
    // //sortable: true,
  },

  {
    name: "organization",
    align: "center",
    label: "Organization",
    field: (row) => get_org(row.org_id),
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
    name: "patient_cr",
    label: "Patient CR",
    field: (row) => row.patient_cr,
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

// Emitted from table component

function deleteItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .deletePatient(item.id)
    .then((res) => {
      if (res.success == true) {
        applyFilter().then(() => {
          notification.success(res.message);
          Loading.hide();
        });
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
    name: "edit-patient",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchPatient(item.id)
    .then((res) => {
      if (res.success == true) {
        showItemData.value = res.data;
        showDialog.value = true;
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
