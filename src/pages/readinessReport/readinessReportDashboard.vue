<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.readiness.title }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          apiUrl="filters/rediness-ruler"
          type="report"
          reportType="readiness"
          :reportData="fetchReportData"
          title="ReadinessRuler"
          :columns="columns"
          rowKey="id"
          @selected="onSelection"
          @delete="deleteItem"
          @edit="editItem"
          @view="showItem"
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

            <q-btn-dropdown
              color="primary"
              :label="patientName.label ? patientName.label : 'Patient-CR'"
            >
              <q-list v-for="(item, index) in patientList" :key="index">
                <q-item clickable v-close-popup @click="selectPatient(item)">
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn
              color="primary"
              @click="calender = true"
              :label="
                dateRange?.from
                  ? dateRange.from + ' to ' + dateRange.to
                  : dateRange ?? 'Select Date'
              "
            />

            <q-btn
              v-if="orgName || dateRange || patientName"
              @click="clearFilter"
              icon="la la-times"
            />

            <!-- <q-checkbox
              v-model="status"
              val="200"
              :label="$q.lang.user.filter.status_checkbox.lock_label"
              @click="applyFilter"
            /> -->

            <!-- <q-btn
              v-if="orgName || dateRange || patientName"
              color="primary"
              @click="applyFilter"
              >{{ $q.lang.user.filter.button }}</q-btn
            > -->
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
          <div class="col text-h6 ellipsis">{{ showItemData.title }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm qimg_remove_extra">
        <q-img :src="showItemData.image" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="calender">
    <q-date
      v-model="dateRange"
      @update:modelValue="handleOnDateChange(val)"
      range
    >
      <q-btn
        label="Submit"
        @click="selectDate"
        v-close-popup
        type="submit"
        color="primary"
      />
    </q-date>
  </q-dialog>
</template>
<script setup>
import { READINESS_REPORT } from "src/apis/constant";
import { defineAsyncComponent, ref, computed } from "vue";
import { patientStore } from "src/stores/patient.js";

import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";
import moment from "moment";

const router = useRouter();
const store = patientStore();
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

const showDialog = ref(false);
const showItemData = ref({});
const tableRefresh = ref(null);
const calender = ref(false);
const dateRange = ref(null);
const orgName = ref("");
const patientName = ref("");
const fetchReportData = ref();

function handleOnDateChange(val) {
  console.log(dateRange.value);
}
function selectOrg(val) {
  orgName.value = val;
  var data = {
    org_id: val.value,
  };
  store.selectOrg(data);
  applyFilter();
}

function selectPatient(val) {
  patientName.value = val;
  console.log(val);
  applyFilter();
}
function selectDate() {
  applyFilter();
}
function clearFilter() {
  orgName.value = "";
  dateRange.value = null;
  patientName.value = "";
  fetchReportData.value = {};
  tableRefresh.value.refresh();
}

function applyFilter() {
  fetchReportData.value = {
    from_date: dateRange.value?.from ?? dateRange.value,
    to_date: dateRange.value?.to ?? dateRange.value,
    patient_id: patientName.value.value,
    org_id: orgName.value.value,
  };
  console.log(fetchReportData.value);
  tableRefresh.value.refresh();
}

const columns = [
  {
    name: "id",
    label: "NO.",
    field: "index",
    // //sortable: true,
    align: "left",
  },

  {
    name: "patient",
    required: true,
    label: "Patient",
    align: "left",
    field: (row) => row.patient_name,
    format: (val) => `${val}`,
    // //sortable: true,
  },

  {
    name: "organization",
    align: "center",
    label: "Organization",
    field: (row) => row.org_name,
    format: (val) => `${val}`,
    //sortable: true,
  },
  {
    name: "patient_cr",
    required: true,
    label: "Patient-CR",
    align: "left",
    field: (row) => row.patient_cr,
    format: (val) => `${val}`,
    // //sortable: true,
  },

  // {
  //   name: "question",
  //   required: true,
  //   label: "Question",
  //   align: "left",
  //   field: (row) => row.question.question,
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },
  // {
  //   name: "scale",
  //   required: true,
  //   label: "Scale",
  //   align: "left",
  //   field: (row) => row.scale,
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },
  {
    name: "date",
    required: true,
    label: "Date",
    align: "left",
    field: (row) => moment(row.created_at).format("MM-DD-YYYY"),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "download",
    label: "Actions",
    field: "download",
  },
];

store.fetchOrganization();
const organizationList = computed(() => {
  return store.organizationList;
});

const patientList = computed(() => {
  return store.orgWisePatient;
});

function get_org(id) {
  return organizationList.value.find((item) => item.value === id)?.label;
}

function deleteItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .deleteVibe(item.id)
    .then((res) => {
      if (res.success == true) {
        tableRefresh.value.refresh().then(() => {
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
    name: "edit-vibeOMeter",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchVibe(item.id)
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
//$
h3.comman-title {
  font-size: $value-25;
  font-weight: map-get($font-weights, medium);
  margin-left: $value-33;
  padding-top: $value-20;
}
</style>
