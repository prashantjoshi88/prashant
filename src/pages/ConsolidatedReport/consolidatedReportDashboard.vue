<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ $q.lang.mainLayout.sidebar.ConsolidatedReport }}
      </h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box consilated_report_bg">
        <table-component
          ref="tableRefresh"
          apiUrl="dashboard/report-patient"
          reportType="readiness"
          type="report"
          :reportData="fetchReportData"
          title="Consolidated Report"
          isPdfDownload="false"
          :columns="columns"
          noBottom="true"
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

            <!-- <q-btn-dropdown
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
            /> -->

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
          <template v-slot:counter>
            <tr>
              <th colspan="14" style="padding: 0">
                <div class="q-mb-lg q-mt-lg">
                  <div class="row q-col-gutter-md">
                    <div class="col-md-3">
                      <div class="bg-box bg-res q-pa-md">
                        <div class="box_flex">
                          <div class="sub-img-online sub-img">
                            <img src="~assets/images/onlineuser.svg" alt="" />
                          </div>
                          <div class="sub-box-text q-pl-md">
                            <h4 class="title">{{ counter.total_patient }}</h4>
                            <p class="q-mb-none">Total Patient</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="bg-box bg-res q-pa-md">
                        <div class="box_flex">
                          <div class="sub-img-online sub-img">
                            <img src="~assets/images/onlineuser.svg" alt="" />
                          </div>
                          <div class="sub-box-text q-pl-md">
                            <h4 class="title">{{ counter.today_login }}</h4>
                            <p class="q-mb-none">Today Logged In</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="bg-box bg-res q-pa-md">
                        <div class="box_flex">
                          <div class="sub-img-online sub-img">
                            <img src="~assets/images/onlineuser.svg" alt="" />
                          </div>
                          <div class="sub-box-text q-pl-md">
                            <h4 class="title">{{ counter.never_login }}</h4>
                            <p class="q-mb-none">Never Logged In</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <!-- Counter -->
            <!-- <div class="col-md-3" v-for="items in counter.count" :key="items">
              <router-link
                class="col-md-3 text-black"
                :to="{
                  name: 'patient-dashboard',
                  query: { slug: items.org_id },
                }"
              >
                <div class="sub-box sub-box-online">
                  <div class="sub-img-online sub-img">
                    <img src="~assets/images/onlineuser.svg" alt="" />
                  </div>
                  <div class="sub-box-text q-mt-md q-pl-md">
                    <h5 class="title">{{ items.patient_count }}</h5>
                    <p>{{ items.org_name }}</p>
                  </div>
                </div>
              </router-link>
            </div> -->
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

store.fetchConsolidatedCounter();
const counter = computed(() => {
  return store.getConsolidatedCounter;
});

function handleOnDateChange(val) {
  console.log(dateRange.value);
}
function selectOrg(val) {
  orgName.value = val;
  var data = {
    org_id: val.value,
  };
  store.selectOrg(data);
  store.fetchConsolidatedCounter(data);
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
  store.fetchConsolidatedCounter();
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
    name: "patient_cr",
    required: true,
    label: "MR No",
    align: "left",
    field: (row) => row.patient_cr,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "Access Given Date",
    align: "left",
    field: (row) => moment(row.created_at).format("MM-DD-YYYY"),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "firstDate",
    required: true,
    label: "First Login Date",
    align: "left",
    field: (row) => moment(row.firstinfo?.created_at).format("MM-DD-YYYY"),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "LastDate",
    required: true,
    label: "Last Login Date",
    align: "left",
    field: (row) => moment(row.lastinfo?.created_at).format("MM-DD-YYYY"),
    format: (val) => `${val}`,
    // //sortable: true,
  },

  {
    name: "lastVibe",
    required: true,
    label: "Vibe O Meter Submit Last date",
    align: "left",
    field: (row) =>
      row.total_phq9
        ? moment(row.lastvibe?.created_at).format("MM-DD-YYYY")
        : "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "phqAssessment",
    required: true,
    label: "Total PHQ-9 assessments Done",
    align: "left",
    field: (row) => row.total_phq9 ?? "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "firstPHQ",
    align: "center",
    label: "PHQ-9 first submission Date",
    field: (row) =>
      row.firstphq ? moment(row.firstphq?.created_at).format("MM-DD-YYYY") : "",
    format: (val) => `${val}`,
    //sortable: true,
  },

  {
    name: "lastPHQ",
    required: true,
    label: "PHQ-9 last Submission Date",
    align: "left",
    field: (row) =>
      row.lastphq ? moment(row.lastphq?.created_at).format("MM-DD-YYYY") : "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "phqExcess",
    required: true,
    label: "PHQ-9  excess Days",
    align: "left",
    field: (row) => row.total_phq9_diff ?? "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "totalRR",
    required: true,
    label: "Total RR assessments Done",
    align: "left",
    field: (row) => row.total_rediness ?? "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "RRFirst",
    required: true,
    label: "RR first submission Date",
    align: "left",
    field: (row) =>
      row.firstrediness
        ? moment(row.firstrediness?.created_at).format("MM-DD-YYYY")
        : "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "RRLast",
    required: true,
    label: "RR last Submission Date",
    align: "left",
    field: (row) =>
      row.lastrediness
        ? moment(row.lastrediness?.created_at).format("MM-DD-YYYY")
        : "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "RRExcess",
    required: true,
    label: "RR excess Days",
    align: "left",
    field: (row) => row.total_rediness_diff ?? "",
    format: (val) => `${val}`,
    // //sortable: true,
  },
  // {
  //   name: "article",
  //   required: true,
  //   label: "Article",
  //   align: "left",
  //   field: (row) => row.artical_name,
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },

  // {
  //   name: "download",
  //   label: "Actions",
  //   field: "download",
  // },
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
.consilated_report_bg {
  .box_flex {
    display: map-get($displays, flex);
  }
  .sub-box-text {
    .title {
      line-height: $value-30;
      margin-bottom: $value-10;
      text-align: left;
    }
    p {
      font-size: map-get($font-sizes, font-14);
    }
  }

  table {
    thead {
      border: none !important;
      tr {
        border: none;
        th {
          border: none;
        }
      }
    }
    tbody {
      display: none;
    }
  }
  .q-table__bottom {
    display: none;
  }
}
</style>
